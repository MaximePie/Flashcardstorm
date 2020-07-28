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

Route::name('api.')->group(static function () {

    /**************************
     * For connected Users
     * *************************
     */
    Route::group(['middleware' => ['auth:api']], static function () {
        Route::prefix('authenticated')->group(static function () {
            Route::get('question/{mode}/{already_in_bag_questions}', 'QuestionController@randomQuestion');
            Route::get('dailyQuestions', 'QuestionController@dailyQuestions');
            Route::get('nonInitiatedQuestions', 'QuestionController@notInitiatedQuestion');
            Route::get('nonInitiatedQuestionsCount', 'QuestionController@notInitiatedQuestionsCount');
            Route::get('me/score', 'UserController@score');
            Route::get('me', 'UserController@me');
            Route::get('me/statistics', 'UserController@showStatistics');
            Route::get('me/dailyObjectives', 'UserController@showDailyObjectives');
            Route::get('myMemorizedQuestions', 'UserController@memorizedQuestionsForConnectedUser');
            Route::get('users', 'UserController@index');
            Route::get('vote/{changelog}', 'UservoteController@toggle');
            Route::get('update_progress', 'UserController@updateProgress');

            Route::get('question/delete/{question}', 'QuestionController@destroy');
            Route::get('showQuestion/{question}', 'QuestionController@show');
            Route::get('question/{mode}', 'QuestionController@randomQuestion');
            Route::get('questions_list/{visibility?}', 'QuestionController@index');
            Route::get('categories', 'CategoryController@index');
            Route::get('changelogs', 'ChangelogController@index');
            Route::get('quest', 'QuestEntityController@index');
            Route::get('initialQuest', 'QuestEntityController@initialize');

            Route::post('category', 'CategoryController@store');
            Route::post('question/toggle', 'QuestionController@toggleQuestionForUser');
            Route::post('question/submit_answer', 'QuestionController@submitAnswer');
            Route::post('questionUser/save', 'QuestionUserController@updateFromAnswer');
            Route::post('question/initiate', 'QuestionController@tryInitiate');
            Route::post('question', 'QuestionController@store');
            Route::post('mnemonics', 'MnemonicController@store');
            Route::post('question_import', 'QuestionController@import');
            Route::post('quest_attack', 'QuestEntityController@attack');
        });
    });

    /***************************
     * For Visitors
     * *************************
     */
    Route::group(['middleware' => ['guest:api']], static function () {
        Route::post('register', 'RegisterController@create');

        Route::get('changelogs', 'ChangelogController@index');
        Route::get('question/{mode}', 'QuestionController@randomQuestion');
        Route::get('question/{mode}/{already_in_bag_questions}', 'QuestionController@randomQuestion');
        Route::get('question/delete/{question}', 'QuestionController@destroy');
        Route::get('questions_list/{visibility?}', 'QuestionController@index');
        Route::get('categories', 'CategoryController@index');
        Route::post('question', 'QuestionController@store');
        Route::post('question/submit_answer', 'QuestionController@submitAnswer')->middleware('guest');
    });
});
