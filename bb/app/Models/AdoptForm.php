<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdoptForm extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'pet_id',
        'adoption_reason',
        'contact_phone',
        'contact_email',
        'address',
        'previous_pets',
        'motivation',
        'status'
    ];
    
    protected $attributes = [
        'status' => 'pending',
    ];
    
    // Relationships
    public function pet()
    {
        return $this->belongsTo(Pet::class);
    }
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}