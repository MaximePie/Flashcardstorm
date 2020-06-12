<?php

namespace App\Http\Controllers;

use App\QuestEntity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class QuestEntityController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index()
    {
        return new JsonResponse([
            'hero' => Auth::user()->hero()->first(),
            'monster' => QuestEntity::query()->whereNull('user_id')->first(),
        ]);
    }

    /**
     * Display the initial values of the hero
     */
    public function initialize()
    {
        $user = Auth::user();
        /** @var QuestEntity $hero */
        $hero = $user->hero()->first();
        if (!$hero) {
            $hero = QuestEntity::create([
                'user_id' => $user->id,
                "name" => $user->name,
                "current_health" => 100,
                "max_health" => 100,
                "attack" => 10,
                "current_experience" => 0,
                "to_next_level_experience" => 190,
                "level" => 1,
            ]);
        }

        $hero->current_health = $hero->max_health;
        $hero->save();

        /** @var QuestEntity $monster */
        $monster = QuestEntity::query()->whereNull('user_id')->first();

        if (!$monster) {
            $monster = QuestEntity::create([
                'name' => 'Le gros méchant loup',
                'current_health' => 30,
                'max_health' => 30,
                'attack' => 8,
                'current_experience' => 80,
                'level' => 1,
            ]);
        }
        $monster->current_health = $monster->max_health;
        $monster->save();
    }

    /**
     * Handle the attack action
     * @param Request $request
     * @return JsonResponse
     */
    public function attack(Request $request)
    {
        /** @var QuestEntity $attacker */
        $attacker = QuestEntity::findOrFail($request->attacker);
        /** @var QuestEntity $victim */
        $victim = QuestEntity::findOrFail($request->victim);

        $victim->current_health -= $attacker->attack;

        $victim->save();

        return new JsonResponse(['lostHealth' => $attacker->attack]);
    }


    /**
     * Display the specified resource.
     *
     * @param QuestEntity $questEntity
     * @return Response
     */
    public function show(QuestEntity $questEntity)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param QuestEntity $questEntity
     * @return Response
     */
    public function edit(QuestEntity $questEntity)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param QuestEntity $questEntity
     * @return Response
     */
    public function update(Request $request, QuestEntity $questEntity)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param QuestEntity $questEntity
     * @return Response
     */
    public function destroy(QuestEntity $questEntity)
    {
        //
    }
}
