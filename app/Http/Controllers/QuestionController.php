<?php

namespace App\Http\Controllers;

use App\Answer;
use App\Mnemonic;
use App\Question;
use App\Question_user;
use App\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
        $questions = Question::OriginalsOnly()->paginate(100);
        if ($user && $visibility === 'for_user') {
            $questions = $user->questions()->paginate(100);
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
            $questions = User::randomQuestions($mode, $already_in_bag_questions, $limit, $user);
            $message = User::questionMessage($questions->isEmpty(), $mode, $user);

            if ($questions) {
                $questions->each(static function (QUESTION $question) use ($user) {
                    $question->preparedForView($user);
                });
            }
        }

        return response()->json([
            'questions' => $questions ?? null,
            'message' => $message,
        ]);
    }

    /**
     * Returns question/answer pairs to the user
     *
     * @return JsonResponse
     */
    public function notInitiatedQuestion(): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        if ($user) {
            $questions = $user->notInitiatedQuestions()->inRandomOrder()->limit(Question_user::initiationSize)->get();
            $answers = collect();
            if ($questions) {
                $questions->each(static function (QUESTION $question) use ($answers, $user) {
                    $question->preparedForView($user);
                    $answers->add($question->answer()->first());
                    $question['answer'] = $question->answer()->first();
                });
            }

            return response()->json([
                'questions' => $questions->shuffle() ?? [],
                'answers' => $answers->shuffle() ?? [],
            ]);
        } else {
            return response()->json(['error' => 'Vous ne pouvez pas continuer car vous n\'êtes pas connecté.']);
        }
    }

    /**
     * Returns the user's not Initiated questions count
     * @return int
     */
    public function notInitiatedQuestionsCount(): int
    {
        $user = Auth::user();
        return $user->notInitiatedQuestions()->count();
    }

    /**
     * Returns all daily questions to the user so he can immediately answer
     * the ones he already knows
     * @param string|null $filterCategories If we need to filter on specific categories
     * @return JsonResponse
     */
    public function dailyQuestions(string $filterCategories = ''): JsonResponse
    {
        $categories = $filterCategories !== '' ? explode(',', $filterCategories) : null;

        /** @var User $user */
        $user = Auth::user();
        if ($user) {
            $questions = $user->dailyQuestions();

            if ($categories) {
                $questions = $questions->whereIn('questions.category_id', $categories);
            }

            $questions = $questions
                ->orderBy('reverse_question_id')
                ->inRandomOrder()
                ->limit(30)
                ->get();
            if ($questions) {
                $questions->each(static function (QUESTION &$question) use ($user) {
                    $question->preparedForView($user);
                });
            }

            return response()->json([
                'questions' => $questions->shuffle() ?? [],
                'timestamp' => time(),
            ]);
        } else {
            return response()->json(['error' => 'Vous ne pouvez pas continuer car vous n\'êtes pas connecté.']);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     * @throws Exception
     */
    public function store(Request $request): JsonResponse
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
            'wording' => $request->question ?? null,
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

        return response()->json(['Question' => $question]);
    }

    /**
     * Attach an image to the given question
     *
     * @param Request $request
     * @return JsonResponse
     * @throws Exception
     */
    public function storeImage(Request $request): JsonResponse
    {
        $questionId = $request->get('question_id');
        $path = $request->file('image')->store(
            'questions',  ['disk' => 'public']
        );
        $question = Question::find($questionId);
        $question->image_path = $path;
        $question->save();


        return response()->json([$question]);
    }

    /**
     * Import a lot of questions ! WOOHOO !
     *
     * @param Request $request
     * @return JsonResponse
     * @throws Exception
     */
    public function import(Request $request)
    {
        $user = Auth::user();
        $added_questions = 0;
        foreach ($request->get('questions') as $question) {
            $question = $question[0];
            $answer = Answer::create([
                'wording' => explode(';', $question)[1],
            ]);

            $question = Question::create([
                'wording' => explode(';', $question)[0],
                'answer_id' => $answer->id,
            ]);

            $question->createReverseQuestion();

            if ($user) {
                Question_user::create(['user_id' => $user->id, 'question_id' => $question->id]);
            }
            $added_questions++;
        }

        return response()->json(['Questions ajoutées ' => $added_questions]);
    }

    /**
     * Try to initiate a question based on the given tuple
     *
     * @param Request $request
     * @return int
     */
    public function tryInitiate(Request $request)
    {
        $question = Question::findOrFail($request->question);
        /** @var Question_user $question_user */
        $question_user = Question_user::findFromTuple($question->id, Auth::user()->id)->first();
        $question_user->isInitiated = true;
        $question_user->save();
        return 200;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Question $question
     * @return Question
     */
    public function show(Question $question)
    {
        $question->preparedForView(Auth::user());
        return $question;
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
     * @param Question $question The question we want to delete
     * @return JsonResponse
     */
    public function destroy(Question $question)
    {
        return response()->json($question->forceDelete());
    }

    /**
     * Compares the submitted answer with the real answers and saves if it is a success
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
                $earned_points = $question_user->saveSuccess($user, $request->mode, $request->is_golden_card);
            }

            return response()->json([
                'text' => 'Bien joué !',
                'status' => 200,
                'earned_points' => $earned_points,
                'userProgress' => $user ? $user->dailyProgress() : null,
            ]);
        } else if ($user && $question->isSetForUser($user)) {
            /** @var Question_user $question_user */
            $question_user = Question_user::findFromTuple($question->id, $user->id)->first();
            $question_user->isInitiated = false;
            $question_user->save();

            /** @var Mnemonic $hint */
            $hint = $question_user->mnemonics()->inRandomOrder()->first();
        }

        return response()->json([
            'text' => 'Oups !',
            'status' => 500,
            'earned_points' => $earned_points,
            'correct_answer' => $question->is_reverse ? $question->wording : $question->answer()->first()->wording,
            'userProgress' => $user ? $user->dailyProgress() : null,
            'questionId' => $question->id,
            'hint' => isset($hint) && $hint ? $hint->wording : null,
        ]);
    }
}
