<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pet;
use Illuminate\Support\Facades\Storage;

class PetController extends Controller
{
    // Get all pets
    public function index()
    {
        $pets = Pet::all();
        return response()->json($pets);
    }

    // Store a new pet
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'age' => 'required|integer',
            'location' => 'required|string|max:255',
            'type' => 'required|string',
            'breed' => 'nullable|string|max:255', // Add breed as optional
            'picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
    
        // Store the image
        $imagePath = $request->file('picture')->store('public/images');
        $imageUrl = Storage::url($imagePath);
    
        // Create the pet
        $pet = Pet::create([
            'name' => $request->name,
            'breed' => $request->breed, // Make sure this field is present in the request
            'age' => $request->age,
            'location' => $request->location,
            'type' => $request->type,
            'image' => $imageUrl,
        ]);
        
    
        return response()->json($pet, 201);
    }
}    