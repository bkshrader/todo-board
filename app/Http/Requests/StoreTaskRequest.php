<?php

namespace App\Http\Requests;

use App\Models\Board;
use App\Models\Category;
use App\Models\Task;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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

        $board = Board::find($this->input('board'));

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
            'board' => 'required|integer|exists:boards,id',
            'category_id' => [
                'required',
                'integer',
                Rule::exists(Category::class, 'id')->where(function ($query) {
                    $query->where('board_id', $this->input('board'));
                }),
            ],
            'name' => 'required|string|max:255',
            'description' => 'sometimes|nullable|string|max:4096',
        ];
    }
}
