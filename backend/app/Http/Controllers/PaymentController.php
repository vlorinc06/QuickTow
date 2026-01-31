<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\User;
use App\Models\TowUser;
use App\Models\TowRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    public function index()
    {
        return Payment::with('user','towUser','towRequest')->get();
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'price'=>'required',
            'date'=>'required',
            'user'=>'required',
            'tow_user'=>'required',
            'tow_request'=>'required',
            'payment_method'=>'required'
        ]);
        if ($validator->fails()) 
        {
            return response()->json(['Validation failed:' => $validator->errors()], 400);
        }

        $payment = Payment::create($request->all());
        return response()->json(['Payment created successfully'=>$payment],201);
    }


    public function getById($id)
    {
        $payment = Payment::find($id);
        if(is_null($payment))
        {
            return response('Payment not found',404);
        }
        return response()->json($payment,200);
    }
    

    public function getBy($type, $id)
    {
        $allowed = ['user','tow_user','tow_request'];

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
        else if ($type == "tow_request")
        {
            $userExists = TowRequest::find($id);
            if(is_null($userExists))
            {
                return response('Tow request not found',404);
            }
        }

        $payment = Payment::where($type,'=',$id)->get();
        
        if($payment->isEmpty())
        {
            return response('No payment found',200);
        }
        return response()->json($payment,200);
    }
}
