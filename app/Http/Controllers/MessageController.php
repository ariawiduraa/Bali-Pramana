<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $messages = Message::with('sender')
            ->where('receiver_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();
            
        // Get admin contact for footer
        $admin = User::where('role', 'admin')->first();

        return Inertia::render('Mailbox', [
            'messages' => $messages,
            'adminContact' => $admin ? [
                'email' => $admin->email,
                'phone' => '6281939617915' // Dummy admin phone
            ] : null
        ]);
    }

    public function markAsRead(Request $request, $id)
    {
        $message = Message::where('receiver_id', $request->user()->id)->findOrFail($id);
        $message->update(['read_at' => now()]);
        return redirect()->back();
    }

    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $request->receiver_id,
            'subject' => $request->subject,
            'body' => $request->body,
        ]);

        return redirect()->back()->with('success', 'Message sent successfully.');
    }
}
