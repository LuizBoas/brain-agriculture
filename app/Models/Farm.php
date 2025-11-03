<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Malico\LaravelNanoid\HasNanoids;

class Farm extends Model
{
    use HasFactory, HasNanoids;

    protected $table = 'farms';
    protected $nanoidPrefix = 'farm';

    protected $fillable = [
        'producer_id',
        'name',
        'city',
        'state',
        'total_area',
        'arable_area',
        'vegetation_area',
    ];

    protected $casts = [
        'total_area' => 'decimal:2',
        'arable_area' => 'decimal:2',
        'vegetation_area' => 'decimal:2',
    ];

    public function producer(): BelongsTo
    {
        return $this->belongsTo(Producer::class, 'producer_id', 'id');
    }

    public function harvests(): HasMany
    {
        return $this->hasMany(Harvest::class, 'farm_id', 'id');
    }
}
