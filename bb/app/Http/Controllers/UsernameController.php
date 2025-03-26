<?php


namespace App\Http\Controllers;

use App\Models\Username;
use Illuminate\Http\Request;

class UsernameController extends Controller
{
    // Get all users
    public function index()
    {
        $users = Username::all();
        return response()->json($users);
    }

    // Create a new user
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:username,email',
            'password' => 'required|string|min:6',
        ]);

        $user = Username::create($validatedData);
        return response()->json($user, 201);
    }

    // Get a specific user by ID
    public function show($id)
    {
        $user = Username::findOrFail($id);
        return response()->json($user);
    }

    // Update a user
    public function update(Request $request, $id)
    {
        $user = Username::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|unique:username,email,' . $user->id,
            'password' => 'sometimes|string|min:6',
        ]);

        $user->update($validatedData);
        return response()->json($user);
    }

    // Delete a user
    public function destroy($id)
    {
        $user = Username::findOrFail($id);
        $user->delete();
        return response()->json(null, 204);
    }
}