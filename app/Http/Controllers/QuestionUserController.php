<?php

namespace App\Http\Controllers;

use App\Mnemonic;
use App\Question;
use App\Question_user;
use App\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class QuestionUserController extends Controller
{

    /**
     * Update the questionController after a submission
     * @param Request $request
     * @return JsonResponse
     * @throws Exception
     */
    public function updateFromAnswer(Request $request): JsonResponse
    {
        /** @var Question $question */
        $question = QUESTION::query()->find($request->id);
        $question->is_reverse = $request->is_reverse_question;

        $user = Auth::user();
        $earned_points = 0;

        if ($request->isCorrect) {
            if ($user) {
                $question_user = QUESTION_USER::query()->firstOrCreate(['user_id' => $user->id, 'question_id' => $question->id]);
                $question_user->save();
                $earned_points = $question_user->saveSuccess($user, $request->mode, $request->is_golden_card);
            }

            return response()->json([
                'status' => 200,
                'earned_points' => $earned_points,
                'userProgress' => $user ? $user->dailyProgress() : null,
            ]);
        }
        else if ($user && $question->isSetForUser($user)) {
            /** @var Question_user $question_user */
            $question_user = Question_user::findFromTuple($question->id, $user->id)->first();
            $question_user->isInitiated = false;
            $question_user->save();

            /** @var Mnemonic $hint */
            $hint = $question_user->mnemonics()->inRandomOrder()->first();
        }

        return response()->json([
            'status' => 500,
            'earned_points' => $earned_points,
            'correct_answer' => $question->is_reverse ? $question->wording : $question->answer()->first()->wording,
            'userProgress' => $user ? $user->dailyProgress() : null,
            'questionId' => $question->id,
            'hint' => isset($hint) && $hint ? $hint->wording : null,
        ]);
    }

    /**
     * Returns the scheduled questions for mental training for corresponding User
     * @return JsonResponse
     * @throws Exception
     */
    public function questionsForMentalTraining() {

        /** @var User $user */
        $user = Auth::user();

        $questions = $user->dailyMentalQuestions()->get();
        $questions->each(function(Question $question) use ($user){
            $question->preparedForView($user);
        });
        return response()->json(['questions' => $questions->shuffle() ?? []]);
    }

    /**
     * Save the answer for mental mode
     * @param Request $request The object containing the data
     * @throws Exception
     */
    public function saveMentalAnswer(Request $request) {
        $user = Auth::user();
        /** @var Question_user $questionUser */
        $questionUser = Question_user::findFromTuple($request->get('questionId'), $user->id)->first();

        if (!$questionUser) {
            throw new Exception('Cette question n\'est pas assignée à l\'utilisateur encore...');
        }

        if ($request->get('isSuccessfullyAnswered')) {
            $questionUser->saveSuccess($user, 'mental');
        }
    }
}
