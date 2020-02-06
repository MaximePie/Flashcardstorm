<?php

namespace App;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * App\Changelog.
 *
 * @property int $id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string $title
 * @property string $text
 * @property string $nextstep
 * @method static Builder|Changelog newModelQuery()
 * @method static Builder|Changelog newQuery()
 * @method static Builder|Changelog query()
 * @method static Builder|Changelog whereCreatedAt($value)
 * @method static Builder|Changelog whereId($value)
 * @method static Builder|Changelog whereNextstep($value)
 * @method static Builder|Changelog whereText($value)
 * @method static Builder|Changelog whereTitle($value)
 * @method static Builder|Changelog whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Changelog extends Model
{
    protected $fillable = ['title', 'text', 'nextstep'];
}
