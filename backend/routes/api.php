<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\TowRequestController;
use App\Http\Controllers\TowUserController;


Route::get('/users',[UserController::class,'index']);
Route::get('/users/id/{id}',[UserController::class,'getById']);
Route::post('/users',[UserController::class,'store']);
Route::put('/users/{id}',[UserController::class,'update']);
Route::delete('/users/{id}',[UserController::class,'destroy']);


Route::get('/vehicles',[VehicleController::class,'index']);
Route::get('/vehicles/id/{id}',[VehicleController::class,'getById']);
Route::get('/vehicles/user/{user}',[VehicleController::class,'getByUser']);
Route::post('/vehicles',[VehicleController::class,'store']);


Route::get('/towusers',[TowUserController::class,'index']);
Route::get('/towusers/id/{id}',[TowUserController::class,'getById']);
Route::get('/towusers/radius/',[TowUserController::class,'getWithinRadius']);
Route::get('/towusers/status/{status}',[TowUserController::class,'getStatus']);
Route::get('/towusers/minrating/{rating}',[TowUserController::class,'getMinRating']);
Route::post('/towusers',[TowUserController::class,'store']);
Route::put('/towusers/{id}',[TowUserController::class,'update']);
Route::delete('/towusers/{id}',[TowUserController::class,'destroy']);


Route::get('/towrequests',[TowRequestController::class,'index']);
Route::get('/towrequests/id/{id}',[TowRequestController::class,'getById']);
Route::get('/towrequests/getby/{type}/{id}',[TowRequestController::class,'getBy']);
Route::post('/towrequests',[TowRequestController::class,'store']);
Route::put('/towrequests/{id}',[TowRequestController::class,'update']);


Route::get('/payments',[PaymentController::class,'index']);
Route::get('/payments/getby/{type}/{id}',[PaymentController::class,'getBy']);
Route::post('/payments',[PaymentController::class,'store']);


Route::get('/ratings',[RatingController::class,'index']);
Route::get('/ratings/id/{id}',[RatingController::class,'getById']);
Route::get('/ratings/getby/{type}/{id}',[RatingController::class,'getBy']);
Route::post('/ratings',[RatingController::class,'store']);
Route::delete('/ratings/{id}',[RatingController::class,'destroy']);

