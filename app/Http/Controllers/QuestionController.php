<?php

namespace App\Http\Controllers;

use App\Answer;
use App\Question;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $questions = Question::query()->inRandomOrder()->get();
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
        $questions = Question::all();
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
     * @return void
     */
    public function destroy(Question $question)
    {
        //
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @throws \Exception
     */
    public function submitAnswer(Request $request): JsonResponse
    {
        $question = QUESTION::query()->find($request->id);
        if ($request->is_valid) {

            $question->current_delay ++;
            $question->last_answered_at = Carbon::now();
            $question->next_question_at = Carbon::now()->addDays($question->current_delay);
            $question->save();
            // TODO #14 Ajouter le score à l'utilisateur
        }


        return response()->json([
            'Success' => 'Bien noté !',
            'Question' => $question,
        ]);
    }
}
