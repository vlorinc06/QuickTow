<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TowRequest extends Model
{
    use HasFactory;
    protected $table = "tow_requests";
    public $timestamps = false;
    public $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class,'user');
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class,'vehicle');
    }

    public function towUser()
    {
        return $this->belongsTo(TowUser::class,'tow_user');
    }
}
