<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Malico\LaravelNanoid\HasNanoids;

class Producer extends Model
{
    use HasFactory, HasNanoids;

    protected $table = 'producers';
    protected $nanoidPrefix = 'prod';

    protected $fillable = [
        'document',
        'document_type',
        'name',
        'created_by',
    ];

    /**
     * Relacionamento com fazendas
     */
    public function farms(): HasMany
    {
        return $this->hasMany(Farm::class, 'producer_id', 'id');
    }

    /**
     * Relacionamento com o usuário que criou
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
}
