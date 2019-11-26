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
            if ($user) {
                $question['score'] = $question->scoreByUser($user);
                $question['is_set_for_user'] = $question->isSetForUser($user);
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
     */
    public function randomQuestion(string $mode = null): JsonResponse
    {
        $message = null;
        $user = Auth::user();

        if ($mode === 'soft' && $user) {
            $questions = Question::forUser($user, true)->inRandomOrder()->get();
            if ($questions->isEmpty()) {
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
                $questions = Question::forUser($user)->inRandomOrder()->get();
            }
            else {
                $questions = Question::query()->inRandomOrder()->get();
            }

            if (!$questions) {
                $message = "Il n'y a pas de question disponible, vous pouvez en créer en cliquant sur Ajouter des Questions";
            }
        }

        $questions->each(static function(Question $question) {
            $question['answer'] = $question->answer()->first()->wording;
        });

        return response()->json(['question' => $questions->first(), 'message' => $message]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return void
     */
    public function create()
    {
        //
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
            'answer_id' => $answer->id
        ]);
        $question->save();

        $user = Auth::user();
        if ($user) {
            Question_user::create(['user_id' => $user->id, 'question_id' => $question->id]);
        }

        return response()->json($question);
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
        if ($request->is_valid && $user) {
            $question_user = QUESTION_USER::query()->firstOrCreate(['user_id' => $user->id, 'question_id' => $question->id]);
            $question_user->save();
            $earned_points = $question_user->save_success($user);
        }

        return response()->json([
            'text' => $request->is_valid ? 'Bien joué !' : 'Oups, ce n\'est pas ça, réessayons !',
            'status' => $request->is_valid ? 200 : 500,
            'earned_points' => $earned_points,
            'correct_answer' => $question->answer()->first()->wording,
        ]);
    }
}
