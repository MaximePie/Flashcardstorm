<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/me', static function (Request $request) {
    return Auth::user();
});

Route::middleware('auth:api')->get('/me/score', 'UserController@score');

Route::middleware('auth:api')->post('/question/submit_answer/authenticated', 'QuestionController@submitAnswer');



Route::post('register', 'RegisterController@create');

Route::get('question', 'QuestionController@randomQuestion');
Route::get('question/delete/{question}', 'QuestionController@destroy');
Route::get('questions_list', 'QuestionController@index');
Route::post('question', 'QuestionController@store');
Route::post('question/submit_answer', 'QuestionController@submitAnswer')->middleware('guest');