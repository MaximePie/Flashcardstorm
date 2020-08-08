<?php

namespace App\Http\Controllers;

use App\Category;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * Get all categories.
     * @param bool $isForUser is true if we only need the categories of the current user
     * @return JsonResponse
     */
    protected function index(bool $isForUser = false): JsonResponse
    {
        $categories = Category::all();
        if ($isForUser) {
            /** @var User $user */
            $user = Auth::user();

            $categories = $categories->whereIn('id', $user->dailyQuestions()->pluck('category_id'));
        }

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
