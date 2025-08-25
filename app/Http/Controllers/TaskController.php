<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // TODO create and show view with paginated list of all tasks for the user
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('tasks/create', [
            'boards' => auth()->user()?->boards()->with('categories')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $board = $request->user()->boards()->findOrFail($request->validated('board'));
        $category = $board->categories()->findOrFail($request->validated('category_id'));
        $category->tasks()->create([
            'reporter_id' => $request->user()->id,
            ...$request->safe()->except(['board', 'category_id']),
        ]);

        return redirect()->route('boards.show', $board)->with('success', 'Task created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        // TODO create and show view with task details
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        // TODO
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        // Update relations if needed
        $isBoardChanged = $request->validated('board') !== $task->board->key();
        $isCategoryChanged = $request->validated('category') !== $task->category->key();
        if ($isBoardChanged || $isCategoryChanged) {

            $targetBoard = $request->user()->boards()->findOrFail($request->validated('board'));
            $targetCategory = $targetBoard->categories()->findOrFail($request->validated('category'));
            $task->category()->associate($targetCategory);
        }

        // Update other fields
        $task->update($request->validated()->except(['board', 'category']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();

        return redirect()->route('boards.show', $task->board)->with('success', 'Task deleted successfully.');
    }
}
