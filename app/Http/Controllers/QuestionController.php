<?php

namespace App\Http\Controllers;

use App\Answer;
use App\Question;
use App\Question_user;
use Carbon\Carbon;
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
        $questions->each(static function(Question $question) {
            $question['answer'] = $question->answer()->first()->wording;
        });
        return response()->json($questions);
    }

    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function randomQuestion(): JsonResponse
    {
        $questions = Question::query()->inRandomOrder()->get();
        $questions->each(static function(Question $question) {
            $question['answer'] = $question->answer()->first()->wording;
        });
        return response()->json($questions);
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
        $question = Question::destroy($question->id);
        $questions = Question::query()->get();
        $questions->each(static function(Question $question) {
            $question['answer'] = $question->answer()->first()->wording;
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
        ]);
    }
}
