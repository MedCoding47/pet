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
}
