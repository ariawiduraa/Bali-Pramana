<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Destination;
use App\Models\DestinationImage;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;

class ContributorController extends Controller
{
    public function index(Request $request)
    {
        $destinations = Destination::with('images')->where('user_id', $request->user()->id)->orderBy('created_at', 'desc')->get();
        return Inertia::render('MyBusiness', [
            'destinations' => $destinations
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:Wisata Alam,Kuliner Lokal',
            'location' => 'required|string|max:255',
            'description' => 'required|string',
            'rules' => 'nullable|string',
            'price' => 'numeric',
            'contact_number' => 'nullable|string|max:20',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'images' => 'nullable|array',
            'images.*' => 'image|max:4096',
            'image_360' => 'nullable|image|max:8192',
        ]);

        $destination = Destination::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'slug' => Str::slug($request->name . '-' . uniqid()),
            'category' => $request->category,
            'location' => $request->location,
            'description' => $request->description,
            'rules' => $request->rules,
            'price' => $request->price ?? 0,
            'contact_number' => $request->contact_number,
            'latitude' => $request->latitude ?? -8.1120,
            'longitude' => $request->longitude ?? 115.0880,
            'status' => 'pending',
        ]);

        // Save regular images
        $dir = database_path('images/destinations');
        if (!File::isDirectory($dir)) {
            File::makeDirectory($dir, 0755, true);
        }

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move($dir, $filename);
                $destination->images()->create([
                    'image_path' => 'database/images/destinations/' . $filename,
                    'is_360' => false,
                ]);
            }
        }

        // Save 360 image (only for Wisata Alam)
        if ($request->hasFile('image_360') && $request->category === 'Wisata Alam') {
            $dir360 = database_path('images/destinations/360');
            if (!File::isDirectory($dir360)) {
                File::makeDirectory($dir360, 0755, true);
            }
            $file = $request->file('image_360');
            $filename = time() . '_360_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move($dir360, $filename);
            $destination->images()->create([
                'image_path' => 'database/images/destinations/360/' . $filename,
                'is_360' => true,
            ]);
        }

        return redirect()->route('my-business');
    }

    public function update(Request $request, $id)
    {
        $destination = Destination::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:Wisata Alam,Kuliner Lokal',
            'location' => 'required|string|max:255',
            'description' => 'required|string',
            'rules' => 'nullable|string',
            'price' => 'numeric',
            'contact_number' => 'nullable|string|max:20',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'images' => 'nullable|array',
            'images.*' => 'image|max:4096',
            'image_360' => 'nullable|image|max:8192',
        ]);

        $destination->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name . '-' . uniqid()),
            'category' => $request->category,
            'location' => $request->location,
            'description' => $request->description,
            'rules' => $request->rules,
            'price' => $request->price ?? 0,
            'contact_number' => $request->contact_number,
            'latitude' => $request->latitude ?? $destination->latitude,
            'longitude' => $request->longitude ?? $destination->longitude,
            'status' => 'pending', // re-submit for approval
        ]);

        // Add new images
        $dir = database_path('images/destinations');
        if (!File::isDirectory($dir)) {
            File::makeDirectory($dir, 0755, true);
        }

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move($dir, $filename);
                $destination->images()->create([
                    'image_path' => 'database/images/destinations/' . $filename,
                    'is_360' => false,
                ]);
            }
        }

        if ($request->hasFile('image_360') && $request->category === 'Wisata Alam') {
            $dir360 = database_path('images/destinations/360');
            if (!File::isDirectory($dir360)) {
                File::makeDirectory($dir360, 0755, true);
            }
            $file = $request->file('image_360');
            $filename = time() . '_360_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move($dir360, $filename);
            $destination->images()->create([
                'image_path' => 'database/images/destinations/360/' . $filename,
                'is_360' => true,
            ]);
        }

        return redirect()->route('my-business');
    }

    public function destroy(Request $request, $id)
    {
        $destination = Destination::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        // Delete image files
        foreach ($destination->images as $img) {
            $path = base_path($img->image_path);
            if (File::exists($path)) {
                File::delete($path);
            }
        }

        $destination->delete();

        return redirect()->route('my-business');
    }

    public function destroyImage(Request $request, $id)
    {
        $image = DestinationImage::findOrFail($id);
        $destination = Destination::where('id', $image->destination_id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $path = base_path($image->image_path);
        if (File::exists($path)) {
            File::delete($path);
        }
        $image->delete();

        return redirect()->back();
    }
}
