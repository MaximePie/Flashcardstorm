<?php

namespace Tests;

use App\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Hash;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    public function user() {
        return User::query()->firstOr('*', static function() {User::create([
                'name' => 'Popol',
                'email' => 'popol@popol.pol',
                'password' => Hash::make('zozo'),
            ]);
        });
    }
}
