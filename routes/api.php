<?php

use Illuminate\Http\Request;

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

Route::middleware('auth:api')->get('/user', static function (Request $request) {
    return $request->user();
});

Route::post('register', 'RegisterController@create');
Route::post('login', 'LoginController@login');
Route::get('logout', 'LoginController@logout');

Route::get('question', 'QuestionController@randomQuestion');
Route::get('question/delete/{question}', 'QuestionController@destroy');
Route::get('questions_list', 'QuestionController@index');
Route::post('question', 'QuestionController@store');
Route::post('question/submit_answer', 'QuestionController@submitAnswer');
