<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory;

    protected $fillable = [
        'order',
        'name',
    ];

    protected $touches = [
        'board',
    ];

    public static function booted()
    {
        static::creating(function (Category $category) {
            // Assign order or update order of other categories in board if necessary
            if (empty($category->order)) {
                // Append category to end of category list if no order is specified
                $category->order = $category->board->categories()->count();
            } else {
                // Clamp order to size of category list
                if ($category->order > ($maxOrder = $category->board->categories()->count())) {
                    $category->order = $maxOrder;
                } else {
                    // Mute events on Category model to prevent unnecessary updates
                    Category::withoutEvents(function () use ($category) {
                        // Shift categories above this one to the right to make room
                        $category->board->categories()
                            ->where($category->getKeyName(), '>=', $category->order)
                            ->increment('order');
                    });
                }
            }
        });

        static::updating(function (Category $category) {
            // Update order of other categories in board if necessary
            if ($category->isDirty('order')) {
                // Clamp order value to last index of board categories
                if ($category->order > ($maxOrder = $category->board->categories()->count() - 1)) {
                    $category->order = $maxOrder;
                }

                // Mute events on Category model to prevent unnecessary updates
                Category::withoutEvents(function () use ($category) {
                    // Shift categories above the updated category's old position down
                    $category->board->categories()
                        ->whereNot($category->getKeyName(), $category->getKey())
                        ->where('order', '>=', $category->getOriginal('order'))
                        ->decrement('order');

                    // Shift categories above the updated category's new position up
                    $category->board->categories()
                        ->whereNot($category->getKeyName(), $category->getKey())
                        ->where('order', '>=', $category->order)
                        ->increment('order');
                });
            }
        });

        static::deleted(function (Category $category) {
            // Mute events on the Category model to prevent unnecessary updates
            Category::withoutEvents(function () use ($category) {
                // Shift categories above the deleted category down
                $category->board->categories()
                    ->where('order', '>=', $category->order)
                    ->decrement('order');
            });
        });
    }

    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class);
    }
}
