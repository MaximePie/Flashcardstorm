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
Route::middleware('auth:api')->post('/authenticated/changelog', 'ChangelogController@store');

Route::middleware('auth:api')->get('/me', static function (Request $request) {
    return Auth::user();
});

/**************************
 * For connected Users
 * *************************
 */
Route::group(['middleware' => ['auth:api']], static function() {
    Route::prefix('authenticated')->group(static function() {
        Route::get('question/{mode}', 'QuestionController@randomQuestion');
        Route::get('users', 'UserController@index');
        Route::get('me/score/{last_checked_at?}', 'UserController@score');
        Route::get('users', 'UserController@index');
        Route::get('update_progress', 'UserController@updateProgress');

        Route::get('questions_list/', 'QuestionController@index');
        Route::get('question/delete/{question}', 'QuestionController@destroy');
        Route::get('question/{mode}', 'QuestionController@randomQuestion');
        Route::get('questions_list/{visibility}', 'QuestionController@index');
        Route::get('categories', 'CategoryController@index');
        Route::get('changelogs', 'ChangelogController@index');

        Route::post('question/toggle', 'QuestionController@toggleQuestionForUser');
        Route::post('question/submit_answer', 'QuestionController@submitAnswer');
    });
});


/***************************
 * For Visitors
 * *************************
 */

Route::post('register', 'RegisterController@create');

Route::get('changelogs', 'ChangelogController@index');
Route::get('question', 'QuestionController@randomQuestion');
Route::get('question/{mode}', 'QuestionController@randomQuestion');
Route::get('question/delete/{question}', 'QuestionController@destroy');
Route::get('questions_list/{visibility}', 'QuestionController@index');
Route::get('categories', 'CategoryController@index');
Route::post('question', 'QuestionController@store');
Route::post('question/submit_answer', 'QuestionController@submitAnswer')->middleware('guest');