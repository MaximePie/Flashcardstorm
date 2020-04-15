<?php


namespace App\Helpers;

use App\User;

/**
 * Provides helpful method for testing and seeding purpose
 * Class UserHelper
 * @package Tests\Feature
 */
class UserHelper
{

    /**
     * Creates a new User
     */
    public static function newUser()
    {
        return User::create([
            'name' => 'gipsi',
            'email' => 'maxime.pie.mail@gmail.com',
            'password' => '123',
        ]);
    }
}
