<?php

namespace App\Http\Controllers;

use App\Changelog;
use Illuminate\Http\Request;

class ChangelogController extends Controller
{
    public function index() {
        return response()->json(Changelog::query()->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request) {
        $changelog = Changelog::create([
            'title' => $request->title,
            'text' => $request->text,
            'nextstep' => $request->nextstep,
        ]);

        $changelog->save();

        return response()->json($changelog);
    }
}
