<?php

namespace App\Http\Controllers;

use App\Mnemonic;
use App\Question_user;
use Auth;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class MnemonicController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return Mnemonic
     */
    public function store(Request $request)
    {
        $questionUser = Question_user::findFromTuple($request->questionId, Auth::user()->id)->first();
        /** @var Mnemonic $mnemonic */
        $mnemonic = Mnemonic::create([
            'question_user_id' => $questionUser->id,
            'wording' => $request->wording
        ]);

        return $mnemonic;
    }

    /**
     * Display the specified resource.
     *
     * @param Mnemonic $mnemonic
     * @return Response
     */
    public function show(Mnemonic $mnemonic)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Mnemonic $mnemonic
     * @return Response
     */
    public function edit(Mnemonic $mnemonic)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Mnemonic $mnemonic
     * @return Response
     */
    public function update(Request $request, Mnemonic $mnemonic)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Mnemonic $mnemonic
     * @return Response
     */
    public function destroy(Mnemonic $mnemonic)
    {
        //
    }
}
