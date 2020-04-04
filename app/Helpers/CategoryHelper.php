<?php

namespace App\Helpers;

use App\Category;

/**
 * Class Category Provides helpful methods for seeding and testing purposes
 */
class CategoryHelper
{
    /**
     * This method is just a syntactic helper for a more intuitive name
     * @return Category
     */
    public static function newCategory(): Category
    {
        return factory(Category::class)->create();
    }


}
