<?php

namespace App\Http\Controllers;

use App\Changelog;
use App\User_vote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UservoteController extends Controller
{

    public function toggle(Changelog $changelog)
    {
        $user = Auth::user();

        if ($user) {
            $userVote = User_vote::query()
                ->where('user_id', $user->id)
                ->where('changelog_id', $changelog->id);

            if ($userVote->count() > 0) {
                $changelog = $userVote->forceDelete();
            }
            else {
                $changelog_user = new User_vote();
                $changelog_user->user_id = $user->id;
                $changelog_user->changelog_id = $changelog->id;
                $changelog_user->save();
            }
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
}
