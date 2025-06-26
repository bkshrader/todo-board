<?php

namespace App\Observers;

use App\Models\Category;
use ValueError;

class CategoryOrderObserver
{
    /**
     * Handle the Category "creating" event.
     *
     * Assigns `order` attribute and updates order of other categories in the same board if necessary
     */
    public function creating(Category $category): void
    {
        // When inserting a new category, the maximum value of order is the size of the existing category list
        $maxOrder = $category->board->categories()->count();

        // Append order to end of category list if order is undefined or greater than size of list
        if (is_null($category->order) || $category->order > $maxOrder) {
            $category->order = $maxOrder;
        } else {
            $this->insertCategory($category);
        }
    }

    /**
     * Handle the Category "updating" event.
     */
    public function updating(Category $category): void
    {
        // Only run update if order is being changed
        if ($category->isClean('order')) {
            return;
        }

        // When updating an existing category, the maximum value of order is the last index of the existing category list
        $maxOrder = $category->board->categories()->count() - 1;

        // Append order to end of category list if order is undefined or greater than size of list
        if (is_null($category->order) || $category->order > $maxOrder) {
            $category->order = $maxOrder;
        }

        $this->removeCategory($category);
        $this->insertCategory($category);
    }

    /**
     * Handle the Category "deleted" event.
     */
    public function deleted(Category $category): void
    {
        $this->removeCategory($category);
    }

    /**
     * Updates the order attribute of sibling categories to remove the given category index from ordering
     */
    protected function removeCategory(Category $category): int
    {
        return $this->shiftCategory($category, $category->getOriginal('order'), 'decrement');
    }

    /**
     *  Updates the order attribute of sibling categories to insert the given category index into ordering
     */
    protected function insertCategory(Category $category): int
    {
        return $this->shiftCategory($category, $category->getAttribute('order'), 'increment');
    }

    protected function shiftCategory(Category $category, int $index, string $direction): int
    {
        if (! in_array($direction, ['increment', 'decrement'])) {
            throw new ValueError('Value of $direction must be either `increment` or `decrement`');
        }

        // Mute events on Category model to prevent unnecessary updates
        return Category::withoutEvents(function () use ($category, $index, $direction) {
            return $category->board->categories()
                ->whereNot($category->getKeyName(), $category->getKey())
                ->where('order', '>=', $index)
                ->{$direction}('order');
        });
    }
}
