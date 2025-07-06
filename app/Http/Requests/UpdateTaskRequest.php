<?php

namespace App\Http\Requests;

use App\Models\Board;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $targetBoard = Board::find($this->input('board_id'));

        if ($this->user()->cannot('update', $targetBoard)) {
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
            'board' => 'required|integer|exists:boards',
            'category' => 'required|integer|exists:categories',
            'name' => 'required|string|max:255',
            'description' => 'sometimes|nullable|string',
        ];
    }
}
