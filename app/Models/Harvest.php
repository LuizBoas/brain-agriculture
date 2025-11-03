<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
// use Illuminate\Database\Eloquent\Relations\HasMany; // Não usado mais
use Malico\LaravelNanoid\HasNanoids;

class Harvest extends Model
{
    use HasFactory, HasNanoids;

    protected $table = 'harvests';
    protected $nanoidPrefix = 'harv';

    protected $fillable = [
        'farm_id',
        'year',
        'name', // Nome da plantação/cultura
    ];

    public function farm(): BelongsTo
    {
        return $this->belongsTo(Farm::class, 'farm_id', 'id');
    }

}
