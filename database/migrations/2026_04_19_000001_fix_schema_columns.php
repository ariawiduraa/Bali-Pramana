<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Fix reviews table: rename review_text -> comment, add image_path
        Schema::table('reviews', function (Blueprint $table) {
            $table->renameColumn('review_text', 'comment');
        });
        Schema::table('reviews', function (Blueprint $table) {
            $table->string('image_path')->nullable()->after('comment');
        });

        // Fix destination_images table: rename image_url -> image_path, ensure is_360 exists
        Schema::table('destination_images', function (Blueprint $table) {
            $table->renameColumn('image_url', 'image_path');
        });
    }

    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropColumn('image_path');
        });
        Schema::table('reviews', function (Blueprint $table) {
            $table->renameColumn('comment', 'review_text');
        });
        Schema::table('destination_images', function (Blueprint $table) {
            $table->renameColumn('image_path', 'image_url');
        });
    }
};
