<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBoardRequest;
use App\Http\Requests\UpdateBoardRequest;
use App\Models\Board;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BoardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $boards = $request->user()->boards()->paginate(15);

        return Inertia::render('boards', [
            'boards' => $boards,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('boards/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBoardRequest $request)
    {
        $board = $request->user()->boards()->create($request->validated());

        return redirect()->route('boards.show', $board)->with('success', 'Board created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Board $board)
    {
        return Inertia::render('boards/show', [
            'board' => $board,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Board $board)
    {
        return Inertia::render('boards/edit', [
            'board' => $board,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBoardRequest $request, Board $board)
    {
        $board->update($request->validated());

        return redirect()->route('boards.show', $board)->with('success', 'Board updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Board $board)
    {
        $board->delete();

        return redirect()->route('boards.index')->with('success', 'Board deleted successfully.');
    }
}
