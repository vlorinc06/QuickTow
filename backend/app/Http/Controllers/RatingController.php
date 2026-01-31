<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rating;
use App\Models\User;
use App\Models\TowUser;
use Illuminate\Support\Facades\Validator;

class RatingController extends Controller
{
    public function index()
    {
        return Rating::with('user','towUser','towRequest')->get();
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'user'=>'required',
            'tow_user'=>'required',
            'tow_request'=>'required',
            'rating'=>'required',
        ]);
        if ($validator->fails()) 
        {
            return response()->json(['Validation failed:' => $validator->errors()], 400);
        }

        $rating = Rating::create($request->all());
        $towUser = TowUser::find($request->tow_user);
        if($towUser)
        {
            $towUser->refreshRating();
        }
        
        return response()->json(['Rating created successfully'=>$rating],201);
    }


    public function destroy($id)
    {
        $rating = Rating::find($id);
        if(is_null($rating))
        {
            return response('Rating not found',404);
        }
        $rating->delete();
        return response('Rating deleted successfully',204);
    }


    public function getById($id)
    {
        $rating = Rating::find($id);
        if(is_null($rating))
        {
            return response('Rating not found',404);
        }
        return response()->json($rating,200);
    }

    
    public function getBy($type, $id)
    {
        $allowed = ['user','tow_user'];
        if(!in_array($type,$allowed))
        {
            return response('Invalid filter type',400);
        }

        $userExists = false;
        if($type == 'user')
        {
            $userExists = User::find($id);
            if(is_null($userExists))
             {
                return response('User not found',404);
            }
        }
        else if ($type == "tow_user")
        {
            $userExists = TowUser::find($id);
            if(is_null($userExists))
            {
                return response('Tow user not found',404);
            }
        }

        $rating = Rating::where($type,'=',$id)->get();
        if($rating->isEmpty())
        {
            return response('No rating found',200);
        }
        return response()->json($rating,200);
    }
}
