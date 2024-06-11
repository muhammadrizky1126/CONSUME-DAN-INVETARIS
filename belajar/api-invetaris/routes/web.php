<?php

/** @var \Laravel\Lumen\Routing\Router $router */

use App\Http\Controllers\InboundStuffController;
use App\Models\InboundStuff;

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->group(['middleware' => 'cors'], function ($router){
    $router->post('/login', 'AuthController@login');
    $router->get('/logout', 'AuthController@logout');
    $router->get('/profile', 'AuthController@me');
    
    
    $router->post('/lending/store', 'LendingController@store');
   
        $router->get('/stuffs/', 'stuffController@index');
        $router->post('/stuffs/store', 'stuffController@store');
        $router->get('/stuffs/trash', 'stuffController@trash');

        $router->post('/inbound-stuffs/store', 'inboundStuffController@store');
       $router->get('/inbound-stuffs/trash', 'InboundStuffController@trash');

       $router->get('/user/', 'userController@index');
       $router->post('/user/postakun', 'userController@postakun');
       $router->get('/user/trash', 'userController@trash');
    
        $router->get('/stuffs/{id}', 'stuffController@show');
        $router->patch('/stuffs/update/{id}', 'stuffController@update');
        $router->delete('/stuffs/delete/{id}', 'stuffController@destroy');
        $router->get('/stuffs/trash/restore/{id}', 'stuffController@restore');
        $router->get('/stuffs/trash/delete-permanent/{id}', 'stuffController@permanentDelete');
    
       $router->get('/user/{id}', 'userController@show');
       $router->patch('/user/update/{id}', 'userController@update');
       $router->delete('/user/delete/{id}', 'userController@destroy');
       $router->get('/user/trash/restore/{id}', 'userController@restore');
       $router->get('/user/trash/delete-permanent/{id}', 'userController@permanentDelete');
    
       $router->delete('/inbound-stuffs/delete/{id}', 'InboundStuffController@destroy');
       $router->get('/inbound-stuffs/trash/restore/{id}', 'InboundStuffController@restore');
       $router->get('/inbound-stuffs/trash/permanent-delete/{id}', 'InboundStuffController@deletePermanent');

       $router->get('/lending/{id}', 'LendingController@show');
       $router->delete('/lending/delete/{id}', 'LendingController@destroy');
       
       
       $router->post('/restorations/{lending_id}', 'RestorationController@store');
    });


