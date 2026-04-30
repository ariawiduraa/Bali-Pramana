<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Destination;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\File;

class AdminController extends Controller
{
    public function index()
    {
        $pendingDestinations = Destination::with(['user', 'images'])->where('status', 'pending')->get();
        $contributors = User::with(['destinations.images'])->where('role', 'contributor')->get()->map(function($user) {
            $user->businessCount = $user->destinations->count();
            return $user;
        });
        
        $stats = [
            'pending' => Destination::where('status', 'pending')->count(),
            'destinations' => Destination::where('status', 'approved')->where('category', 'Wisata Alam')->count(),
            'kuliner' => Destination::where('status', 'approved')->where('category', 'Kuliner Lokal')->count(),
            'contributors' => User::where('role', 'contributor')->count(),
        ];

        return Inertia::render('AdminDashboard', [
            'pendingDestinations' => $pendingDestinations,
            'contributors' => $contributors,
            'stats' => $stats
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'reason' => 'nullable|string'
        ]);

        $destination = Destination::findOrFail($id);
        $destination->status = $request->status;
        $destination->save();

        if ($request->status === 'rejected' && $request->reason) {
            \App\Models\Message::create([
                'sender_id' => $request->user()->id,
                'receiver_id' => $destination->user_id,
                'subject' => 'Penolakan Pengajuan: ' . $destination->name,
                'body' => $request->reason,
            ]);
        }

        return redirect()->route('admin.dashboard');
    }

    public function destroyDestination(Request $request, $id)
    {
        $request->validate([
            'reason' => 'nullable|string'
        ]);

        $destination = Destination::with('images')->findOrFail($id);
        
        if ($request->reason) {
            \App\Models\Message::create([
                'sender_id' => $request->user()->id,
                'receiver_id' => $destination->user_id,
                'subject' => 'Penghapusan Bisnis: ' . $destination->name,
                'body' => $request->reason,
            ]);
        }

        // Delete image files
        foreach ($destination->images as $img) {
            $path = base_path($img->image_path);
            if (File::exists($path)) {
                File::delete($path);
            }
        }

        $destination->delete();
        return redirect()->back();
    }
}
