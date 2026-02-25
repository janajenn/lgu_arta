<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSurveyResponseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'respondent.client_type' => ['required', Rule::in(['citizen', 'business', 'government'])],
            'respondent.date_of_transaction' => ['required', 'date'],
            'respondent.sex' => ['required', Rule::in(['male', 'female', 'prefer_not_to_say'])],
            'respondent.age' => ['required', 'integer', 'min:1', 'max:120'],
            'respondent.region_of_residence' => ['required', 'string', 'max:100'],
            'respondent.service_availed' => ['required', 'string' ],
            'responses' => ['required', 'array'],
            'responses.*' => ['required', 'string'],
            'suggestions' => ['nullable', 'string', 'max:1000'],
            'email' => ['nullable', 'email', 'max:100'],
            'service_id' => ['required', 'exists:services,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'respondent.client_type.required' => 'Please select your client type.',
            'respondent.date_of_transaction.required' => 'Please enter the transaction date.',
            'respondent.sex.required' => 'Please select your sex.',
            'respondent.age.required' => 'Please enter your age.',
            'respondent.region_of_residence.required' => 'Please select your region.',
            'respondent.service_availed.required' => 'Please select the service availed.',
            'responses.required' => 'Please answer all survey questions.',
        ];
    }
}