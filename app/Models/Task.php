<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    /** @use HasFactory<\Database\Factories\TaskFactory> */
    use HasFactory;

    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'reporter_id',
    ];

    public function board(): HasOneThrough
    {
        // Create a belongsToThrough relationship using a hasOneThrough with reversed key names
        return $this->hasOneThrough(
            Board::class,
            Category::class,
            'id',
            'id',
            'category_id',
            'board_id',
        );
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }
}
