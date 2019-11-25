<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;

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
     * @return Response
     */
    protected function showLoggedIn(): Response
    {
        $user = Auth::user();
        return response("AH");
        // return response()->json(["user" => $user, "message" => "ahbah"]);
    }
}
