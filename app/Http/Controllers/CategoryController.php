<?php

namespace App\Http\Controllers;

use App\Category;
use Illuminate\Http\Request;
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

    /**
     * Create a category.
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $category = Category::create([
            'name' => $request->name,
            'icon' => $request->icon,
            'color' => $request->color,
        ]);

        return response()->json($category);
    }
}
