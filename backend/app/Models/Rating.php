<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Rating extends Model
{
    use HasFactory;
    protected $table = "ratings";
    public $timestamps = false;
    public $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class,'user');
    }


    public function towUser()
    {
        return $this->belongsTo(TowUser::class,'tow_user');
    }

        public function towRequest()
    {
        return $this->belongsTo(TowRequest::class,'tow_request');
    }
}
