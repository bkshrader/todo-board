<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Board;
use App\Models\Category;

class CategoryController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Board $board, StoreCategoryRequest $request)
    {
        $board->categories()->create($request->validated());

        return redirect()->route('boards.edit', ['board' => $board])->with('success', 'Board created successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Board $board, Category $category)
    {
        if ($board->isNot($category->board)) {
            abort('Category does not belong to board');
        }

        $category->update($request->validated());

        return redirect()->route('boards.edit', ['board' => $board])->with('success', 'Category updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Board $board, Category $category)
    {
        $category->delete();

        return redirect()->route('boards.edit', ['board' => $board])->with('success', 'Category destroyed successfully');
    }
}
