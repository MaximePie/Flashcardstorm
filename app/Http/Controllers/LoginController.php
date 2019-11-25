<?php

namespace App\Http\Controllers;

use App\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;

class LoginController extends Controller
{
    /**
     * Create a new user instance after a valid registration.
     *
     * @param Request $request
     * @return JsonResponse|\Illuminate\Http\Response
     */
    protected function login(Request $request)
    {
        $user = User::query()->where('email', $request['email'])->first();
        $response = response()->json(['message' => 'Echec', 'status' => 500]);

        if (!$user) {
            return $response;
        }

        if (Hash::check($request['password'], $user->password)) {
            Auth::login($user->first());
            /*
            $cookie = Cookie::make('auth', true, 36000);
            Cookie::queue($cookie);
            return response()->make()->withCookie($cookie);
            */
            $response = response()->json(['message' => 'Success', 'status' => 200]);
        }

        return $response;
    }

    /**
     * @return string
     */
    protected function logout(): string
    {
        Auth::logout();
        Cookie::queue(Cookie::forget('auth'));
        return redirect('/home');
    }
}
