<?php

namespace App\Http\Auth;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller {
    
    public function index() {
        return response()->json(\App\Models\Location::all());
    }
}