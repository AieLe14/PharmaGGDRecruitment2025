<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Display the user dashboard
     */
    public function userDashboard()
    {
        return response()->json([
            'message' => 'Welcome to user dashboard',
            'user' => auth()->user()
        ]);
    }

    /**
     * Display the admin dashboard
     */
    public function adminDashboard()
    {
        return response()->json([
            'message' => 'Welcome to admin dashboard',
            'user' => auth()->user()->load('role')
        ]);
    }
}
