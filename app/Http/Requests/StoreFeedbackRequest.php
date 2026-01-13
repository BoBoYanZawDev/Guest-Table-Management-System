<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFeedbackRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $setting = appSettingCache();
        $requiresSubCategory =
            (int) ($setting['is_show_sub_cat'] ?? 1) === 1;

        $requiresCategory =
            (int) ($setting['is_show_cat'] ?? 1) === 1;

        return [
            'cat_id'    => $requiresCategory
                ? 'required|exists:categories,id'
                : 'nullable|exists:categories,id',
            'subcat_id'    => $requiresSubCategory
                ? 'required|exists:sub_categories,id'
                : 'nullable|exists:sub_categories,id',
            'rating_id'    => 'required|exists:ratings,id',
            'feedback_msg' => 'nullable|string|max:2000',
        ];
    }

    public function messages(): array
    {
        return [
            'cat_id.exists'    => 'The selected category is invalid.',
            'feedback_msg.max' => 'Feedback cannot exceed 2000 characters.',
        ];
    }
}
