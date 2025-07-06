<?php

namespace App\Http\Requests;

use App\Models\Board;
use App\Models\Task;
use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if ($this->user()->cannot('create', Task::class)) {
            return false;
        }

        $board = Board::find($this->input('board_id'));

        return $this->user()->can('update', $board);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'board' => 'required|integer|exists:boards',
            'category' => 'required|integer|exists:categories',
            'name' => 'required|string|max:255',
            'description' => 'sometimes|nullable|string',
        ];
    }
}
