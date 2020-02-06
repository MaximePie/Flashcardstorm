<?php

namespace App\Http\Controllers;

use App\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * Get all categories.
     */
    protected function index(): JsonResponse
    {
        $categories = Category::all();

        return response()->json(['categories' => $categories]);
    }
}
