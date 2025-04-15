<?php
namespace App\Http\Controllers;

use App\Models\AdoptForm;
use Illuminate\Http\Request;

class AdminAdoptionController extends Controller
{
    public function index()
    {
        $requests = AdoptForm::with(['user', 'pet'])->latest()->get();

        return response()->json([
            'requests' => $requests
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'admin_response' => 'nullable|string|max:1000'
        ]);

        $form = AdoptForm::findOrFail($id);
        $form->status = $validated['status'];
        $form->admin_response = $validated['admin_response'] ?? null;
        $form->save();

        return response()->json([
            'message' => 'Demande mise à jour avec succès.',
            'form' => $form
        ]);
    }
}
