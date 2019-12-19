<?php
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::view('/{path?}', 'welcome')->where('path', '(.*)');

/*Route::get('/', function () {
    App::abort(404);
});
*/

Route::group(['middleware' => ['web']], function () {
    Route::auth();
    Route::post('login', 'LoginController@login');
    Route::get('logout', 'LoginController@logout');
});