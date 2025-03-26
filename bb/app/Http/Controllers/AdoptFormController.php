<?php

namespace App\Http\Controllers;

use App\Models\AdoptForm;
use Illuminate\Http\Request;

class AdoptFormController extends Controller
{
    // Get all adoption forms
    public function index()
    {
        $forms = AdoptForm::with(['user', 'pet'])->get();
        return response()->json($forms);
    }

    // Create a new adoption form
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required|exists:username,id',
            'pet_id' => 'required|exists:pets,id',
            'adoption_reason' => 'required|string',
            'status' => 'sometimes|in:pending,approved,rejected',
        ]);

        $form = AdoptForm::create($validatedData);
        return response()->json($form, 201);
    }

    // Get a specific adoption form by ID
    public function show($id)
    {
        $form = AdoptForm::with(['user', 'pet'])->findOrFail($id);
        return response()->json($form);
    }

    // Update an adoption form
    public function update(Request $request, $id)
    {
        $form = AdoptForm::findOrFail($id);

        $validatedData = $request->validate([
            'user_id' => 'sometimes|exists:username,id',
            'pet_id' => 'sometimes|exists:pets,id',
            'adoption_reason' => 'sometimes|string',
            'status' => 'sometimes|in:pending,approved,rejected',
        ]);

        $form->update($validatedData);
        return response()->json($form);
    }

    // Delete an adoption form
    public function destroy($id)
    {
        $form = AdoptForm::findOrFail($id);
        $form->delete();
        return response()->json(null, 204);
    }
}