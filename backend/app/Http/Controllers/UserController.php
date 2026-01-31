<?php

namespace App\Http\Controllers;

use App\Models\Felhasznalo;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    public function index()
    {
        return User::all();
    }


    public function store(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'last_name' => 'required|string|max:50',
                'first_name' => 'required|string|max:50',
                'username' => 'required|string|max:50|unique:users,username',
                'password' => 'required|string',
                'email' => 'required|email|unique:users,email',
                'phone_number' => 'required|string|max:50'
            ]
        );

        if ($validator->fails()) 
        {
            return response()->json(['Validation failed:' => $validator->errors()], 400);
        } 

        $data = $request->all();
        $data['password'] = Hash::make($data['password']);
        $user = User::create($request->all());
        return response()->json(["User created successfully" => $user],201);
    }


    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if(is_null($user))
        {
            return response("User not found",404);
        }

        $validator = Validator::make(
            $request->all(),
            [
                'last_name' => 'sometimes|required|string|max:50',
                'first_name' => 'sometimes|required|string|max:50',
                'username' => 'sometimes|required|string|max:50|unique:users,username,' . $user->id,
                'password' => 'sometimes|required|string',
                'email' => 'sometimes|required|email|unique:users,email,'.$user->id,
                'phone_number' => 'sometimes|required|string|max:50'
            ]
        );
        if ($validator->fails()) 
        {
            return response()->json(['Validation failed:' => $validator->errors()], 400);
        } 

        $user->fill($request->only([
            'last_name',
            'first_name',
            'username',
            'email',
            'phone_number'
        ]));

        $user->password = Hash::make($request->password);

        $user->save();

        return response()->json(['User updated successfully'=>$user],200);
        
    }


    public function destroy($id)
    {
        $user = User::find($id);
        if(is_null($user))
        {
            return response("User not found",404);
        }
        $user->delete();
        return response("User deleted successfully",200);
    }
    

    public function getById($id)
    {
        $user = User::find($id);
        if(is_null($user))
        {
            return response("User not found",404);
        }
        return response()->json($user,200);
    }
}
