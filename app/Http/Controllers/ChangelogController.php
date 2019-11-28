<?php

namespace App\Http\Controllers;

use App\Changelog;
use Illuminate\Http\Request;

class ChangelogController extends Controller
{
    public function index() {
        return response()->json(Changelog::query()->orderBy('created_at')->get());
    }
}
