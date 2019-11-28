<?php

namespace App\Http\Controllers;

use App\Answer;
use App\Question;
use App\Question_user;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $questions = Question::all();
        $user = Auth::user();
        $questions->each(static function(Question $question) use ($user){
            $question['answer'] = $question->answer()->first()->wording;
            $category = $question->category();
            if ($category) {
                $question['category'] = $category->first();
            }
            if ($user) {
                $question['is_set_for_user'] = $question->isSetForUser($user);
                if ($question['is_set_for_user']) {
                    $question['score'] = $question->scoreByUser($user);
                    $question['next_question_at'] = $question->nextQuestionatForUser($user);
                }
            }
        });
        return response()->json($questions);
    }

    /**
     * Display a listing of the resource.
     *
     * @param $question_id
     * @return JsonResponse
     */
    public function toggleQuestionForUser($question_id): JsonResponse
    {
        $user = Auth::user();
        if (!$user) {
            throw new \RuntimeException('User does now exist');
        }
        $question = Question::query()->where('id', $question_id)->first();
        if ($question && $question->exists() && !$question->isSetForUser($user)) {
            $question->attatchToUser($user);
        }
        else {
            $question_user = Question_user::findFromTuple($question->id, $user->id);
            if ($question_user && $question_user->exists()) {
                $question_user->forceDelete();
            }
        }
        return response()->json(['is_set_for_user' => $question->isSetForUser($user)]);
    }

    /**
     * Display a listing of the resource.
     *
     * @param string $mode
     * @return JsonResponse
     * @throws Exception
     */
    public function randomQuestion(string $mode = null): JsonResponse
    {
        $message = null;
        $user = Auth::user();

        if ($mode === 'soft' && $user) {
            $question = Question::forUser($user, true)->inRandomOrder()->first();
            if ($question && $question->exists()) {
                $next_question = Question_user::query()->orderBy('next_question_at', 'asc')->first();
                if ($next_question) {
                    $message = "Vous avez répondu à toutes vos questions pour aujourd'hui. La prochaine question sera prévue pour le " . $next_question->next_question_at;
                }
                else {
                    $message = "Aucune question ne vous est assignée pour le moment. Passez en mode Tempête pour ajouter automatiquement les questions à votre Kit";
                }
            }
        }
        else {
            if ($user && $mode === 'for_user') {
                $question_builder = Question::forUser($user);
            }
            else {
                $question_builder = Question::query();
            }

            $question = $question_builder->inRandomOrder()->first();

            if (!$question) {
                $message = "Il n'y a pas de question disponible, vous pouvez en créer en cliquant sur Ajouter des Questions";
            }
        }

        if ($question) {
            $question['answer'] = $question->answer()->first()->wording;
            $question['is_new'] = !$question->isSetForUser($user) ?: null;
            $category = $question->category();
            if ($category) {
                $question['category'] = $category->first();
            }
            try {
                $question['is_golden_card'] = random_int(0, config('app.golden_card_ratio')) === 1;
            } catch (Exception $e) {
                throw new Exception('Error generating the random golden card');
            }
        }


        return response()->json(['question' => $question, 'message' => $message]);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $answer = Answer::create([
            'wording' => $request->answer,
        ]);

        $answer->save();

        $question = Question::create([
            'wording' => $request->question,
            'answer_id' => $answer->id,
            'category_id' => $request->category ?: null,
        ]);
        $question->save();

        $user = Auth::user();
        if ($user) {
            Question_user::create(['user_id' => $user->id, 'question_id' => $question->id]);
        }

        return response()->json($question);
    }


    /**
     * Import a lot of questions ! WOOHOO !
     *
     * @param  \Illuminate\Http\Request $request
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
                'wording' => explode(';',$question)[0],
                'answer_id' => $answer->id,
            ]);

            if ($user) {
                Question_user::create(['user_id' => $user->id, 'question_id' => $question->id]);
            }
            $added_questions ++;
        }

        return response()->json(['Questions ajoutées ' => $added_questions]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Question  $question
     * @return \Illuminate\Http\Response
     */
    public function show(Question $question)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Question $question
     * @return void
     */
    public function edit(Question $question)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \App\Question $question
     * @return void
     */
    public function update(Request $request, Question $question)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Question $question
     * @return JsonResponse
     * @throws \Exception
     */
    public function destroy(Question $question)
    {
        Question::destroy($question->id);
        $questions = Question::query()->get();
        $user = Auth::user();

        $questions->each(static function(Question $question) use ($user){
            $question['answer'] = $question->answer()->first()->wording;
            if ($user) {
                $question['score'] = $question->scoreByUser($user);
            }
        });

        return response()->json($questions);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @throws \Exception
     */
    public function submitAnswer(Request $request): JsonResponse
    {
        $question = QUESTION::query()->find($request->id);
        $user = Auth::user();
        $earned_points = 0;
        if ($user && $question->isValidWith($request->answer)) {
            $question_user = QUESTION_USER::query()->firstOrCreate(['user_id' => $user->id, 'question_id' => $question->id]);
            $question_user->save();
            $earned_points = $question_user->save_success($user, $request->mode, $request->is_golden_card);
            return response()->json([
                'text' => 'Bien joué !',
                'status' => 200,
                'earned_points' => $earned_points,
            ]);
        }
        else {
            return response()->json([
                'text' => 'Oups, ce n\'est pas ça, réessayons !',
                'status' => 500,
                'earned_points' => $earned_points,
                'correct_answer' => $question->answer()->first()->wording,
            ]);
        }

    }
}
