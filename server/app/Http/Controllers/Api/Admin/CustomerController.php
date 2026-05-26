<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    public function loadCustomers(Request $request)
    {
        $search = $request->input('search');

        $customers = Customer::where('is_deleted', false)
            ->orderBy('last_name', 'asc')
            ->orderBy('first_name', 'asc');

        if ($search) {
            $customers->where(function ($query) use ($search) {
                $query->where('first_name',  'like', "%{$search}%")
                    ->orWhere('middle_name', 'like', "%{$search}%")
                    ->orWhere('last_name',   'like', "%{$search}%")
                    ->orWhere('suffix_name', 'like', "%{$search}%")
                    ->orWhere('username',    'like', "%{$search}%")
                    ->orWhere('contact_number', 'like', "%{$search}%");
            });
        }

        $customers = $customers->paginate(15);

        return response()->json([
            'customers' => $customers
        ], 200);
    }

    public function getCustomer(Customer $customer)
    {
        return response()->json([
            'customer' => $customer
        ], 200);
    }

    public function storeCustomer(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name'           => ['required', 'max:55'],
            'middle_name'          => ['nullable', 'max:55'],
            'last_name'            => ['required', 'max:55'],
            'suffix_name'          => ['nullable', 'max:20'],
            'gender'               => ['nullable', Rule::in(['male', 'female', 'prefer_not_to_say'])],
            'birth_date'           => ['nullable', 'date', 'before:today'],
            'contact_number'       => ['nullable', 'max:20'],
            'address'              => ['nullable', 'string'],
            'username'             => ['nullable', 'min:6', 'max:55', Rule::unique('tbl_customers', 'username')],
            'password'             => ['nullable', 'min:6', 'max:20', 'confirmed'],
            'password_confirmation' => ['nullable', 'min:6', 'max:20'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        $age = null;
        if (!empty($validated['birth_date'])) {
            $age = date_diff(date_create($validated['birth_date']), date_create('now'))->y;
        }

        Customer::create([
            'first_name'     => $validated['first_name'],
            'middle_name'    => $validated['middle_name']  ?? null,
            'last_name'      => $validated['last_name'],
            'suffix_name'    => $validated['suffix_name']  ?? null,
            'gender'         => $validated['gender']       ?? null,
            'birth_date'     => $validated['birth_date']   ?? null,
            'age'            => $age,
            'contact_number' => $validated['contact_number'] ?? null,
            'address'        => $validated['address']      ?? null,
            'username'       => $validated['username']     ?? null,
            'password'       => $validated['password']     ?? null,
        ]);

        return response()->json([
            'message' => 'Customer Successfully Saved.'
        ], 200);
    }

    public function updateCustomer(Request $request, Customer $customer)
    {
        $validator = Validator::make($request->all(), [
            'first_name'           => ['required', 'max:55'],
            'middle_name'          => ['nullable', 'max:55'],
            'last_name'            => ['required', 'max:55'],
            'suffix_name'          => ['nullable', 'max:20'],
            'gender'               => ['nullable', Rule::in(['male', 'female', 'prefer_not_to_say'])],
            'birth_date'           => ['nullable', 'date', 'before:today'],
            'contact_number'       => ['nullable', 'max:20'],
            'address'              => ['nullable', 'string'],
            'username'             => [
                'nullable', 'min:6', 'max:55',
                Rule::unique('tbl_customers', 'username')->ignore($customer->customer_id, 'customer_id'),
            ],
            'password'             => ['nullable', 'min:6', 'max:20', 'confirmed'],
            'password_confirmation' => ['nullable', 'min:6', 'max:20'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        $age = $customer->age;
        if (!empty($validated['birth_date'])) {
            $age = date_diff(date_create($validated['birth_date']), date_create('now'))->y;
        }

        $updateData = [
            'first_name'     => $validated['first_name'],
            'middle_name'    => $validated['middle_name']    ?? null,
            'last_name'      => $validated['last_name'],
            'suffix_name'    => $validated['suffix_name']    ?? null,
            'gender'         => $validated['gender']         ?? $customer->gender,
            'birth_date'     => $validated['birth_date']     ?? $customer->birth_date,
            'age'            => $age,
            'contact_number' => $validated['contact_number'] ?? null,
            'address'        => $validated['address']        ?? null,
            'username'       => $validated['username']       ?? $customer->username,
        ];

        // Only update password if a new one was provided
        if (!empty($validated['password'])) {
            $updateData['password'] = $validated['password'];
        }

        $customer->update($updateData);
        $customer->refresh();

        return response()->json([
            'message'  => 'Customer Successfully Updated.',
            'customer' => $customer
        ], 200);
    }

    public function destroyCustomer(Customer $customer)
    {
        $customer->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'Customer Successfully Deleted.'
        ], 200);
    }
}
