<?php

namespace App\Http\Controllers;

use App\Changelog;
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
     * Show user
     *
     * @return JsonResponse
     */
    protected function showLoggedIn(): JsonResponse
    {
        $user = Auth::user();
        if ($user) {
            return response()->json(['user' => $user, 'statistics' => $user->statistics]);
        }

        return response()->json();
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
            if (! now()->isSameDay($user->last_daily_updated_at) || $user->last_daily_updated_at === null) {
                $user->last_daily_updated_at = now();
                $user->daily_objective = $user->dailyQuestions()->count();
                $user->daily_progress = 0;
                $user->save();
            }

            return response()->json(['userProgress' => $user->dailyProgress()]);
        }
    }
}
