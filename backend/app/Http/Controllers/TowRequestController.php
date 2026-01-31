<?php

namespace App\Http\Controllers;

use App\Models\TowRequest;
use App\Models\User;
use App\Models\TowUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TowRequestController extends Controller
{
    public function index()
    {
        return TowRequest::with('user','vehicle','towUser')->get();
    }
    

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'user'=>'required',
            'vehicle'=>'required',
            'tow_user'=>'required',
            'pickup_lat'=>'required',
            'pickup_long'=>'required',
            'dropoff_lat'=>'required',
            'dropoff_long'=>'required',
            'price'=>'required'
        ]);
        if($validator->fails())
        {
            return response()->json(['Validation failed:' => $validator->errors()], 400);
        }
        $towRequest = TowRequest::create($request->all());
        return response()->json(['Tow request created successfully:'=>$towRequest],201);
    }


    public function update(Request $request, $id)
    {
        $towRequest = TowRequest::find($id);
        if(is_null($towRequest))
        {
            return response("Tow request not found",404);
        }

        $allowed = [
            'status'
        ];

        $validator = Validator::make($request->only($allowed),[
            'status' => 'sometimes|required|string|max:20'
        ]);

        if ($validator->fails()) 
        {
            return response()->json(['Validation failed:' => $validator->errors()], 400);
        } 
        
        $towRequest->fill($request->only($allowed));
        $towRequest->save();

        return response()->json(['Tow request updated successfully'=>$towRequest],200);   
    }


    public function getById($id)
    {
        $towRequest = TowRequest::find($id);
        if(is_null($towRequest))
        {
            return response("Tow request not found",404);
        }
        return response()->json($towRequest,200);
    }


    public function getBy($type,$id)
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

        $towRequest = TowRequest::where($type,'=',$id)->get();
        if($towRequest->isEmpty())
        {
            return response('No tow requests found',200);
        }
        
        return response()->json($towRequest,200);
    }
}
