<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Malico\LaravelNanoid\HasNanoids;

class Harvest extends Model
{
    use HasFactory, HasNanoids, SoftDeletes;

    protected $table = 'harvests';
    protected $nanoidPrefix = 'harv';

    protected $fillable = [
        'farm_id',
        'year',
    ];

    public function farm(): BelongsTo
    {
        return $this->belongsTo(Farm::class, 'farm_id', 'id');
    }

    public function crops(): HasMany
    {
        return $this->hasMany(Crop::class, 'harvest_id', 'id');
    }
}
