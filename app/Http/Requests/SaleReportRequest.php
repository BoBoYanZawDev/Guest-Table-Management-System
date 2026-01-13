<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaleReportRequest extends FormRequest
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
        return [
            'date' => ['required'],
            'c_name' => ['required', 'max:255'],
            'ph_no' => ['required'],
            'payment' => ['required'],

            'region_id' => ['required', 'integer'],
            'sale_person_id' => ['required', 'integer'],
            'branch_id' => ['required', 'integer'],

            'station' => ['nullable'],
            'remark' => ['nullable'],
            'deli_fees' => ['nullable'],
            'action' => ['required', 'string'],

            'items' => ['required', 'array', 'min:1'],
            'items.*.item_code' => ['required'],
            'items.*.item_name' => ['required'],
            'items.*.category_id' => ['required'],
            'items.*.sub_category_id' => ['nullable'],
            'items.*.brand_id' => ['required'],
            'items.*.qty' => ['required', 'min:1'],
            'items.*.amount' => ['required', 'min:0'],
            'items.*.total_amount' => ['required', 'min:0'],
        ];
    }
    public function messages()
    {
        return [
            'items.required' => 'You must add at least one item.',
            'items.*.item_code.required' => 'Item code is required for all items.',
            'items.*.item_name.required' => 'Item name is required for all items.',
            'items.*.category_id.required' => 'Please select a category for each item.',
            'items.*.brand_id.required' => 'Please select a brand for each item.',
            'items.*.qty.required' => 'Quantity is required for each item.',
            'items.*.qty.min' => 'Quantity must be at least 1.',
            'items.*.amount.required' => 'Amount is required for each item.',
            'items.*.total_amount.required' => 'Total amount is required for each item.',
        ];
    }
}
