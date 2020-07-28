<?php

namespace App\Http\Controllers;

use App\Question;
use App\Question_user;
use App\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    protected $user;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = Auth::user();

            return $next($request);
        });
    }

    protected function index(): JsonResponse
    {
        $users = User::query()->orderBy('score', 'desc')->get();

        return response()->json(['users' => $users]);
    }

    /**
     * Show user statistics
     *
     * @return JsonResponse
     */
    protected function showStatistics(): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        if ($user) {
            return response()->json([
                'statistics' => $user->statistics,
            ]);
        }

        return response()->json([
            'error' => "L'utilisateur n'est pas connecté."
        ]);
    }

    /**
     * Show user dailyObjective
     *
     * @return JsonResponse
     */
    protected function showDailyObjectives(): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        if ($user) {

            return response()->json([
                'objectives' => $user->dailyObjectives(),
            ]);
        }

        return response()->json([
            'error' => "L'utilisateur n'est pas connecté."
        ]);
    }

    /**
     * @return JsonResponse
     */
    protected function me(): JsonResponse
    {
        return response()->json([
            'user' => Auth::user(),
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @return JsonResponse
     */
    protected function score(): JsonResponse
    {
        $user = Auth::user();
        if ($user) {
            return response()->json([
                'score' => $user->score,
                'number_of_new_changelogs' => $user->unreadNotifications()->count(),
                'number_of_questions' => $user->dailyQuestions()->count(),
            ]);
        }
    }

    /**
     * Returns the progress of the user.
     *
     * @return JsonResponse
     */
    protected function updateProgress(): JsonResponse
    {
        $user = Auth::user();
        if ($user) {
            if ($user->last_daily_updated_at === null || !now()->isSameDay($user->last_daily_updated_at)) {
                $user->last_daily_updated_at = now();
                $user->daily_objective = $user->dailyQuestions()->count();
                $user->daily_progress = 0;
                $user->save();
            }

            return response()->json([
                'userProgress' => $user->dailyProgress(),
                'statistics' => $user->statistics,
            ]);
        }
    }

    /**
     * Get the memorized questions of the connected User
     * @return JsonResponse
     */
    protected function memorizedQuestionsForConnectedUser(): ?JsonResponse
    {
        $user = Auth::user();
        if ($user) {
            /** @var Question[] $memorizedQuestions */
            $memorizedQuestions = $user->questions()->get();
            foreach ($memorizedQuestions as $question) {
                $question['answer'] = $question->answer()->first()->wording;
                $question['isMemorized'] = $question->isMemorizedForUser($user);
                $question['questionUser'] = Question_user::findFromTuple($question->id, $user->id);
            }

            return response()->json([
                'memorizedQuestions' => $memorizedQuestions,
            ]);
        }
    }
}
