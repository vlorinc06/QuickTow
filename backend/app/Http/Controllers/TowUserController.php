<?php

namespace App\Http\Controllers;

use App\Models\TowUser;
use App\Models\User;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class TowUserController extends Controller
{
    use SoftDeletes;

    public function index()
    {
        return TowUser::all();
    }


    public function store(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'last_name' => 'required|string|max:50',
                'first_name' => 'required|string|max:50',
                'username' => 'required|string|max:50|unique:tow_users,username',
                'password' => 'required|string',
                'email' => 'required|email|unique:tow_users,email',
                'phone_number' => 'required|string|max:50',
                'price_per_km' => 'sometimes|required|integer|min:0'
            ]
        );

        if ($validator->fails()) 
        {
            return response()->json(['Validation failed:' => $validator->errors()], 400);
        } 

        $data = $request->all();
        $data['password'] = Hash::make($data['password']);
        $user = TowUser::create($data);
        return response()->json(["User created successfully" => $user],201);
    
    }


    public function update(Request $request, $id)
    {
        $user = TowUser::find($id);
        if(is_null($user))
        {
            return response("Tow User not found",404);
        }

        $validator = Validator::make(
            $request->all(),
            [
                'last_name' => 'sometimes|required|string|max:50',
                'first_name' => 'sometimes|required|string|max:50',
                'username' => 'sometimes|required|string|max:50|unique:tow_users,username,' . $user->id,
                'password' => 'sometimes|required|string',
                'email' => 'sometimes|required|email|unique:tow_users,email,'.$user->id,
                'phone_number' => 'sometimes|required|string|max:50',
                'price_per_km' => 'sometimes|required|integer|min:0'
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
            'phone_number',
            'latitude',
            'longitude'
        ]));

        $user->password = Hash::make($request->password);
        $user->save();
        return response()->json(['Tow User updated successfully'=>$user],200);
        
    }


    public function destroy($id)
    {
        $user = TowUser::find($id);
        if(is_null($user))
        {
            return response("Tow User not found",404);
        }
        $user->delete();
        return response("Tow User deleted successfully",200);
    }


    public function getById($id)
    {
        $user = TowUser::find($id);
        if(is_null($user))
        {
            return response("Tow User not found",404);
        }
        return response()->json($user,200);
    }


    public function getStatus($status)
    {
        $allowed = ['offline','busy','available'];

        if(!in_array($status,$allowed))
        {
            return response('Invalid status',400);
        }

        $towUser = TowUser::where('status','=',$status)->get();
        if($towUser->isEmpty())
        {
            return response('No tow users found',200);
        }
        return response()->json($towUser,200);
        
    }

    
    public function getMinRating($rating)
    {
        $towUser = TowUser::where('rating','>=',$rating)->get();
        if($towUser->isEmpty())
        {
            return response('No tow users found',200);
        }
        return response()->json($towUser,200);
    }


    public function getWithinRadius(Request $request)
    {   
        $validator = Validator::make($request->all(),[
            'lat' => 'required|numeric',
            'long' => 'required|numeric',
            'radius' => 'required|numeric|min:1|max:100'
        ]);
        if ($validator->fails()) 
        {
            return response()->json(['Validation failed:' => $validator->errors()], 400);
        } 

        $lat = (float) $request->query('lat');
        $long = (float) $request->query('long');
        $radius = (float) $request->query('radius');

        $towUsers = TowUser::withinRadius($lat,$long,$radius)->get();

        if($towUsers->isNotEmpty())
        {
            return response()->json($towUsers,200);
        }
        return response("No tow users found withing the given radius",204);
    }
}
