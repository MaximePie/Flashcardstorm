<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Changelog.
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $title
 * @property string $text
 * @property string $nextstep
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Changelog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Changelog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Changelog query()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Changelog whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Changelog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Changelog whereNextstep($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Changelog whereText($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Changelog whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Changelog whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Changelog extends Model
{
    protected $fillable = ['title', 'text', 'nextstep'];
}
