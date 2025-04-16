<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AdoptForm;
use Illuminate\Support\Facades\Auth;

class ClientAdoptionController extends Controller
{
    public function index(Request $request)
{
    $user = $request->user();

    $requests = AdoptForm::with('pet')
        ->where('user_id', $user->id)
        ->orderByDesc('created_at')
        ->get();

    return response()->json(['requests' => $requests]);
}

}
