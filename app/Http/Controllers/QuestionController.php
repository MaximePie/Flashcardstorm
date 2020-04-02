<?php

namespace App\Http\Controllers;

use App\Answer;
use App\Question;
use App\Question_user;
use App\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use RuntimeException;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param string $visibility
     * @return JsonResponse
     */
    public function index(string $visibility = 'all'): JsonResponse
    {
        $user = Auth::user();
        $questions = Question::OriginalsOnly()->paginate(20);
        if ($user && $visibility === 'for_user') {
            $questions = $user->questions()->paginate(20);
        }

        $questions->each(static function (Question $question) use ($user) {
            $answer = $question->answer()->first();
            $question['answer'] = $answer->wording;
            $category = $question->category();
            if ($category) {
                $question['category'] = $category->first();
            }
            if ($user) {
                $question['isSetForUser'] = $question->isSetForUser($user);
                if ($question['isSetForUser']) {
                    $question['score'] = $question->scoreByUser($user);
                    $question['next_question_at'] = $question->nextQuestionAtForUser($user);
                }
            }

            if ($question->revertedQuestion()->count()) {
                $question['has_reverse'] = true;
            }
        });

        return response()->json(['questions' => $questions]);
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function toggleQuestionForUser(Request $request): JsonResponse
    {
        $user = Auth::user();
        if (!$user) {
            throw new RuntimeException('User does now exist');
        }

        foreach ($request->questions as $selected_question) {
            $question = Question::findOrFail($selected_question['id']);

            if ($selected_question['isSetForUser'] && !$question->isSetForUser($user)) {
                Question_user::create(['user_id' => $user->id, 'question_id' => $question->id]);
            } else if (!$selected_question['isSetForUser']) {
                $question->users()->detach($user);
            }
        }

        return response()->json(['Questions' => $user->questions()->get()]);
    }

    /**
     * Returns a random question for the user.
     *
     * @param string $mode The mode we want to use
     * @param null $questions_bag_ids
     * @return JsonResponse
     */
    public function randomQuestion(string $mode = null, $questions_bag_ids = null): JsonResponse
    {
        $message = null;
        /** @var User $user */
        $user = Auth::user();
        $already_in_bag_questions = explode(',', $questions_bag_ids);
        $limit = config('app.question_bag_max_size') - count($already_in_bag_questions);
        if ($limit > 0) {
            if ($mode === 'soft' && $user) {
                $questions = $user->dailyQuestions()
                    ->whereNotIn('question_users.question_id', $already_in_bag_questions)
                    ->inRandomOrder()
                    ->limit($limit)
                    ->get();

                if ($questions->isEmpty()) {
                    $next_question = $user->nextQuestion();
                    if ($next_question) {
                        $message = "Vous avez répondu à toutes vos questions pour aujourd'hui. La prochaine question sera prévue pour le " . $next_question->next_question_at;
                    } else {
                        $message = 'Aucune question ne vous est assignée pour le moment. Passez en mode Tempête pour ajouter automatiquement les questions à votre Kit';
                    }
                }
            } else {
                if ($user && $mode === 'for_user') {
                    $question_builder = $user->questions();
                } else {
                    $question_builder = Question::query();
                }

                $questions = $question_builder->inRandomOrder()
                    ->limit($limit)
                    ->get();

                if (!$questions) {
                    $message = "Il n'y a pas de question disponible, vous pouvez en créer en cliquant sur Ajouter des Questions";
                }
            }

            if ($questions) {
                $questions->each(static function (QUESTION $question) use ($user) {
                    $answer = $question->answer()->first();
                    $question['answer'] = $answer->wording;
                    if ($user) {
                        $question['is_new'] = !$question->isSetForUser($user) ?: null;
                    }
                    $question['additionalAnswers'] = $answer->additional_answers;
                    $category = $question->category();
                    if ($category) {
                        $question['category'] = $category->first();
                    }

                    $question->tryGoldenCard();
                });
            }
        }

        return response()->json([
            'questions' => $questions ?? null,
            'message' => $message,
            'next_question' => $next_question ?? null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     * @throws Exception
     */
    public function store(Request $request)
    {
        $answer = Answer::create([
            'wording' => $request->answer,
        ]);

        if ($request->additionalAnswers) {
            $additionalAnswers = $request->additionalAnswers;
            $additionalAnswers = substr($additionalAnswers, 0, -1); // Removing last character
            $answer->additional_answers = $additionalAnswers;
        }
        $answer->save();

        $question = Question::create([
            'wording' => $request->question,
            'answer_id' => $answer->id,
            'category_id' => $request->category ?: null,
            'is_mcq' => $answer->additional_answers !== null,
        ]);

        Question::query()->leftJoinSub(Question::query()->whereNotNull('reverse_question_id'),
            'lonelyQuestion',
            'lonelyQuestion.id',
            '=',
            'question.id'
        );
        $question->save();

        if ($request->shouldHaveReverseQuestion) {
            $question->createReverseQuestion();
        }

        $user = Auth::user();
        if ($user) {
            Question_user::create(['user_id' => $user->id, 'question_id' => $question->id]);
        }

        return response()->json(['Question' => $question, 'Resquest Category' => $request->category]);
    }

    /**
     * Import a lot of questions ! WOOHOO !
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function import(Request $request)
    {
        $user = Auth::user();
        $added_questions = 0;
        foreach ($request->questions as $question) {
            $question = $question[0];
            $answer = Answer::create([
                'wording' => explode(';', $question)[1],
            ]);

            $question = Question::create([
                'wording' => explode(';', $question)[0],
                'answer_id' => $answer->id,
            ]);

            if ($user) {
                Question_user::create(['user_id' => $user->id, 'question_id' => $question->id]);
            }
            $added_questions++;
        }

        return response()->json(['Questions ajoutées ' => $added_questions]);
    }

    /**
     * Display the specified resource.
     *
     * @param Question $question
     * @return Response
     */
    public function show(Question $question)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Question $question
     * @return void
     */
    public function edit(Question $question)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Question $question
     * @return void
     */
    public function update(Request $request, Question $question)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $questionId
     * @return JsonResponse
     */
    public function destroy(Int $questionId)
    {
        Question::destroy($questionId);

        return response()->json('Success');
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @throws Exception
     */
    public function submitAnswer(Request $request): JsonResponse
    {
        $question = QUESTION::query()->find($request->id);
        $question->is_reverse = $request->is_reverse_question;

        $user = Auth::user();
        $earned_points = 0;
        if ($request->answer && $question->isValidWith($request->answer)) {
            if ($user) {
                $question_user = QUESTION_USER::query()->firstOrCreate(['user_id' => $user->id, 'question_id' => $question->id]);
                $question_user->save();
                $earned_points = $question_user->save_success($user, $request->mode, $request->is_golden_card);
            }

            return response()->json([
                'text' => 'Bien joué !',
                'status' => 200,
                'earned_points' => $earned_points,
                'userProgress' => $user ? $user->dailyProgress() : null,
            ]);
        }

        return response()->json([
            'text' => 'Oups, ce n\'est pas ça, réessayons !',
            'status' => 500,
            'earned_points' => $earned_points,
            'correct_answer' => $question->is_reverse ? $question->wording : $question->answer()->first()->wording,
            'userProgress' => $user ? $user->dailyProgress() : null,
        ]);
    }
}
