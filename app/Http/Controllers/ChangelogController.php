<?php

namespace App\Http\Controllers;

use App\Changelog;
use App\User_vote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChangelogController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if ($user) {
            $user->unreadNotifications()->get()->markAsRead();
        }

        $changelogs = Changelog::query()->orderBy('created_at', 'desc')->get();

        $changelogs->each(static function ($changelog) use ($user) {
            $changelog['numberOfVotes'] = $changelog->numberOfVotes();
            if ($user) {
                $changelog['isSetForUser'] = User_vote::query()
                        ->where('user_id', $user->id)
                        ->where('changelog_id', $changelog->id)
                        ->count() > 0;
            }
        });

        return response()->json($changelogs);
    }

    public function store(Request $request)
    {
        $changelog = Changelog::create([
            'title' => $request->title,
            'text' => $request->text,
            'nextstep' => $request->nextstep,
        ]);

        $changelog->save();

        return response()->json($changelog);
    }
}
