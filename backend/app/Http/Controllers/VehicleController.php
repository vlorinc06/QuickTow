<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vehicle;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class VehicleController extends Controller
{
    public function index()
    {
        return Vehicle::with('user')->get();
    }

    
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'license_plate'=>'required',
            'brand'=>'required',
            'model'=>'required',
            'user'=>'required'
        ]);
        if ($validator->fails()) 
        {
            return response()->json(['Validation failed:' => $validator->errors()], 400);
        } 
        $vehicle = Vehicle::create($request->all());
        return response()->json(["Vehicle created successfully:"=>$vehicle],201);
    }


    public function destroy($id)
    {
        $vehicle = Vehicle::find($id);
        if(is_null($vehicle))
        {
            return response("Vehicle not found",404);
        }
        $vehicle->delete();
        return response("Vehicle deleted successfully",204);
    }


    public function getById($id)
    {
        $vehicle = Vehicle::find($id);
        if(is_null($vehicle))
        {
            return response("Vehicle not found",404);
        }
        return response()->json($vehicle,200);
    }


    public function getByUser($id)
    {
        $userExists = User::find($id);
        if(is_null($userExists))
        {
            return response('User not found',404);
        }

        $vehicles = Vehicle::where('user','=',$id)->get();
        if($vehicles->isEmpty())
        {
            return response('No vehicles found',200);
        }
        
        return response()->json($vehicles,200);
    }
}
