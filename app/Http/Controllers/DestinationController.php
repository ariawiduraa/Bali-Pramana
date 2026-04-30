<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Destination;
use App\Models\Review;
use Inertia\Inertia;
use Illuminate\Support\Facades\File;

class DestinationController extends Controller
{
    public function show($slug)
    {
        $destination = Destination::with(['images', 'reviews.user'])
            ->where('slug', $slug)
            ->firstOrFail();

        return Inertia::render('DestinationDetail', [
            'destination' => $destination
        ]);
    }

    public function storeReview(Request $request, $id)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string',
            'image' => 'nullable|image|max:2048'
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $dir = database_path('images/reviews');
            if (!File::isDirectory($dir)) {
                File::makeDirectory($dir, 0755, true);
            }
            $file = $request->file('image');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move($dir, $filename);
            $imagePath = 'database/images/reviews/' . $filename;
        }

        Review::create([
            'user_id' => $request->user()->id,
            'destination_id' => $id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'image_path' => $imagePath,
        ]);

        return redirect()->back();
    }

    public function updateReview(Request $request, $id)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string',
        ]);

        $review = Review::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $review->rating = $request->rating;
        $review->comment = $request->comment;
        $review->save();

        return redirect()->back();
    }

    public function destroyReview(Request $request, $id)
    {
        $review = Review::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        // Delete image file if exists
        if ($review->image_path && File::exists(base_path($review->image_path))) {
            File::delete(base_path($review->image_path));
        }

        $review->delete();

        return redirect()->back();
    }
}