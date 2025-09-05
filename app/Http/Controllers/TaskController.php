<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
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
        return Inertia::render('tasks/show', [
            'task' => $task->load(['board', 'board.categories', 'category', 'reporter']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        return Inertia::render('tasks/edit', [
            'task' => $task->load(['board', 'board.categories', 'category', 'reporter']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        // Update relations if needed
        $isBoardChanged = optional($request->validated('board'), fn ($boardId) => $boardId !== $task->board->getKey());
        $isCategoryChanged = optional($request->validated('category_id'), fn ($categoryId) => $categoryId !== $task->category->getKey());
        Log::debug('Updating task relations', [
            'board' => $request->validated('board'),
            'category_id' => $request->validated('category_id'),
            'task' => $task->toArray(),
            'isBoardChanged' => $isBoardChanged,
            'isCategoryChanged' => $isCategoryChanged,
        ]);
        if ($isBoardChanged || $isCategoryChanged) {
            $targetCategory = $request->getTargetBoard()->categories()->findOrFail($request->validated('category_id'));
            $task->category()->associate($targetCategory);
        }

        // Update other fields
        $task->update($request->safe()->except(['board', 'category_id']));
        Log::debug('Updated task', ['task' => $task->toArray()]);

        return redirect()->route('tasks.show', ['task' => $task])->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        // If 'force' query parameter is true, permanently delete the task
        // Otherwise, perform a soft delete
        $method = request()->input('force') === 'true' ? 'forceDelete' : 'delete';
        $methodName = $method === 'forceDelete' ? 'deleted' : 'archived';

        if (! request()->user()->can($method, $task)) {
            abort(Response::HTTP_FORBIDDEN);
        }

        $task->{$method}();

        return redirect()->route('boards.show', ['board' => $task->board])->with('success', "Task {$methodName} successfully.");
    }
}
