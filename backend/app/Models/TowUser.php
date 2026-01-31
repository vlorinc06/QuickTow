<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TowUser extends Model
{
    use HasFactory;
    protected $table = "tow_users";
    public $timestamps = false;
    public $guarded = [];
    

    protected $hidden = [
        'password'
    ];

    public function ratings()
    {
        return $this->hasMany(Rating::class,'tow_user');
    }

    public function refreshRating()
    {
        $this->rating = $this->ratings()->avg('rating') ?? 0;
        $this->rating_count = $this->ratings()->count();
        $this->save();
    }

    public function scopeWithinRadius($query, float $lat, float $lng, float $radius)
    {
        return $query->selectRaw("
            tow_users.*,
            (
                6371 * acos(
                    cos(radians(?)) * cos(radians(latitude))
                    * cos(radians(longitude) - radians(?))
                    + sin(radians(?)) * sin(radians(latitude))
                )
            ) AS distance
        ", [$lat, $lng, $lat])
        ->having("distance","<=",$radius);
    }
}
