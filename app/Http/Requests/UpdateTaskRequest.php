<?php

namespace App\Http\Requests;

use App\Models\Board;
use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if ($this->user()->cannot('update', $this->getTargetBoard())) {
            return false;
        }

        return $this->user()->can('update', $this->route('task'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'board' => 'sometimes|required|integer|exists:boards,id',
            'category_id' => [
                'required_with:board',
                'sometimes',
                'integer',
                Rule::exists(Category::class, 'id')->where(function ($query) {
                    $query->where('board_id', $this->getTargetBoard()->getKey());
                }),
            ],
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string|max:4096',
        ];
    }

    public function getTargetBoard(): Board
    {
        return optional($this->input('board'), fn ($board) => Board::findOrFail($board)) ?? $this->route('task')->board;
    }
}
