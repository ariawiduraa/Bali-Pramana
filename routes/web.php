<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DestinationController;

/*
|--------------------------------------------------------------------------
| Bali Pramana Web Routes
|--------------------------------------------------------------------------
*/

// Home / Listing Page
Route::get('/', function () {
    $destinations = \App\Models\Destination::with(['images', 'reviews'])->where('status', 'approved')->get();
    return Inertia::render('Home', ['destinations' => $destinations]);
})->name('home');

// Map Page
Route::get('/map', function () {
    $destinations = \App\Models\Destination::with(['images', 'reviews'])->where('status', 'approved')->get();
    return Inertia::render('MapScreen', ['destinations' => $destinations]);
})->name('map');

use App\Http\Controllers\ProfileController;

// Profile Page
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
});

// Serve images from database/images directory
Route::get('/db-images/{path}', function ($path) {
    $filePath = database_path('images/' . $path);
    if (!file_exists($filePath)) {
        abort(404);
    }
    return response()->file($filePath, [
        'Access-Control-Allow-Origin' => '*',
        'Cache-Control' => 'public, max-age=86400',
    ]);
})->where('path', '.*')->name('db.image');

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ContributorController;

// Admin Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/admin', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::put('/admin/destinations/{id}', [AdminController::class, 'updateStatus'])->name('admin.destination.update');
    Route::delete('/admin/destinations/{id}', [AdminController::class, 'destroyDestination'])->name('admin.destination.destroy');

    // Contributor Routes
    Route::get('/my-business', [ContributorController::class, 'index'])->name('my-business');
    Route::post('/destinations', [ContributorController::class, 'store'])->name('destination.store');
    Route::put('/destinations/{id}', [ContributorController::class, 'update'])->name('destination.update');
    Route::delete('/destinations/{id}', [ContributorController::class, 'destroy'])->name('destination.destroy');
    Route::delete('/destination-images/{id}', [ContributorController::class, 'destroyImage'])->name('destination.image.destroy');

    // Reviews
    Route::post('/destinations/{id}/reviews', [DestinationController::class, 'storeReview'])->name('review.store');
    Route::put('/reviews/{id}', [DestinationController::class, 'updateReview'])->name('review.update');
    Route::delete('/reviews/{id}', [DestinationController::class, 'destroyReview'])->name('review.destroy');

    // Mailbox
    Route::get('/mailbox', [\App\Http\Controllers\MessageController::class, 'index'])->name('mailbox.index');
    Route::put('/mailbox/{id}/read', [\App\Http\Controllers\MessageController::class, 'markAsRead'])->name('mailbox.read');
    Route::post('/mailbox/send', [\App\Http\Controllers\MessageController::class, 'store'])->name('mailbox.store');
});

// Destination Detail
Route::get('/destination/{slug}', [DestinationController::class, 'show'])
    ->name('destination.show');

    
Route::get('/test', function () {
    return "OK";
});


// Dashboard (protected by Breeze)
Route::get('/dashboard', function () {
    return redirect()->route('profile');
})->middleware(['auth', 'verified'])->name('dashboard');

// Auth routes (Laravel Breeze)
require __DIR__.'/auth.php';