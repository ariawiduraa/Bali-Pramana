<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'category',
        'location',
        'description',
        'rules',
        'price',
        'latitude',
        'longitude',
        'status',
        'contact_number',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function images()
    {
        return $this->hasMany(DestinationImage::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
