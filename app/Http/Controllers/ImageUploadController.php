<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ImageUploadController extends Controller
{
    /**
     * Upload property image to storage
     */
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:10240', // 10MB max
        ]);

        try {
            $image = $request->file('image');
            
            // Generate unique filename
            $filename = Str::random(40) . '.' . $image->getClientOriginalExtension();
            
            // Store in private properties directory
            $path = $image->storeAs('', $filename, 'properties');
            
            return response()->json([
                'success' => true,
                'image_path' => $path,
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to upload image: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete property image from storage
     */
    public function delete(Request $request)
    {
        $request->validate([
            'image_path' => 'required|string',
        ]);

        try {
            $path = $request->input('image_path');
            
            if (Storage::disk('properties')->exists($path)) {
                Storage::disk('properties')->delete($path);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Image deleted successfully',
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'error' => 'Image not found',
                ], 404);
            }
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to delete image: ' . $e->getMessage(),
            ], 500);
        }
    }
}