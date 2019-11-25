<?php

namespace App\Http\Controllers;

use App\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    /**
     * Create a new user instance after a valid registration.
     *
     * @param Request $request
     * @return string
     * @throws Exception
     */
    protected function login(Request $request): string
    {
        $user = User::query()->where('email', $request['email'])->first();
        if (!$user) {
            throw new Exception('User does not exist');
        }
        if (Hash::check($request['password'], $user->password)) {
            Auth::login($user->first());
            $cookie = cookie('auth', true, 36000);
            return response('Connected')->withCookie($cookie);
        }

        throw new Exception('User does not exist');
    }

    /**
     * @return string
     */
    protected function logout(): string
    {
        Auth::logout();
        return response('Déconnecté')->cookie(
            'auth', false, 36000
        );
    }
}
