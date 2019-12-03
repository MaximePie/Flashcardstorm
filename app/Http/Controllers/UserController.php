<?php

namespace App\Http\Controllers;

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
     * Create a new user instance after a valid registration.
     *
     * @return JsonResponse
     */
    protected function showLoggedIn(): JsonResponse
    {
        $user = Auth::user();
        return response()->json(["user" => $user]);
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
            return response()->json(['score' => $user->score]);
        }
    }

    /**
     * Returns the progress of the user
     *
     * @return JsonResponse
     */
    protected function updateProgress(): JsonResponse
    {
        $user = Auth::user();
        if ($user) {
            if (!now()->isSameDay($user->last_daily_updated_at)) {
                $user->last_daily_updated_at = now();
                $user->daily_objective = $user->questions(true)->count();
                $user->daily_progress = 0;
                $user->save();
            }
            return response()->json(['userProgress' => $user->dailyProgress()]);
        }
    }
}
