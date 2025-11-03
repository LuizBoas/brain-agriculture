<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Malico\LaravelNanoid\HasNanoids;

class Crop extends Model
{
    use HasFactory, HasNanoids;

    protected $table = 'crops';
    protected $nanoidPrefix = 'crop';

    protected $fillable = [
        'harvest_id',
        'name',
    ];

    public function harvest(): BelongsTo
    {
        return $this->belongsTo(Harvest::class, 'harvest_id', 'id');
    }
}
