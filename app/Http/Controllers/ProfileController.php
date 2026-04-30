<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $reviews = \App\Models\Review::with('destination')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Profile', [
            'userReviews' => $reviews,
            'totalReviews' => $reviews->count(),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'password' => 'nullable|string|min:8|confirmed',
            'avatar' => 'nullable|image|max:2048',
        ]);

        $user->name = $request->name;

        if ($request->password) {
            $user->password = \Illuminate\Support\Facades\Hash::make($request->password);
        }

        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists in database/images/profiles
            if ($user->avatar && str_contains($user->avatar, 'database/images/profiles')) {
                $oldPath = base_path($user->avatar);
                if (file_exists($oldPath)) {
                    unlink($oldPath);
                }
            }

            $dir = database_path('images/profiles');
            if (!file_exists($dir)) {
                mkdir($dir, 0755, true);
            }

            $file = $request->file('avatar');
            $filename = time() . '_' . $user->id . '.' . $file->getClientOriginalExtension();
            $file->move($dir, $filename);
            
            $user->avatar = 'database/images/profiles/' . $filename;
        }

        $user->save();

        return Redirect::route('profile');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
