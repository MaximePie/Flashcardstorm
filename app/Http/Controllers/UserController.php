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
}
