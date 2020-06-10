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
            'monster' => QuestEntity::where('name', 'Le gros méchant loup')->first(),
        ]);
    }

    /**
     * Display the initial values of the hero
     *
     * @return JsonResponse
     */
    public function initialize()
    {
        /** @var QuestEntity $hero */
        $hero = Auth::user()->hero()->first();
        $hero->current_health = $hero->max_health;
        $hero->save();
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
