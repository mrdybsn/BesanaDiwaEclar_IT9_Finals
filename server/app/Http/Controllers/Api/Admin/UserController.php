<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function loadUsers(Request $request)
    {
        $search = $request->input('search');

        $users = User::where('is_deleted', false)
            ->orderBy('last_name', 'asc')
            ->orderBy('first_name', 'asc')
            ->orderBy('middle_name', 'asc');

        if ($search) {
            $users->where(function ($query) use ($search) {
                $query->where('first_name', 'like', "%{$search}%")
                    ->orWhere('middle_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('suffix_name', 'like', "%{$search}%")
                    ->orWhere('role', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%");
            });
        }

        $users = $users->paginate(15);

        $users->getCollection()->transform(function ($user) {
            $user->profile_picture = $user->profile_picture
                ? url('storage/public/img/user/profile_picture/' . $user->profile_picture)
                : null;
            return $user;
        });

        return response()->json([
            'users' => $users
        ], 200);
    }

    public function loadRiders()
    {
        $riders = User::where('role', 'rider')
            ->where('is_active', true)
            ->where('is_deleted', false)
            ->orderBy('last_name', 'asc')
            ->get();

        return response()->json([
            'riders' => $riders
        ], 200);
    }

    public function storeUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'add_user_profile_picture' => ['nullable', 'image', 'mimes:png,jpg,jpeg'],
            'first_name'               => ['required', 'max:55'],
            'middle_name'              => ['nullable', 'max:55'],
            'last_name'                => ['required', 'max:55'],
            'suffix_name'              => ['nullable', 'max:20'],
            'role'                     => ['required', Rule::in(['admin', 'staff', 'rider', 'customer'])],
            'birth_date'               => ['required', 'date', 'before:today'],
            'contact_number'           => ['nullable', 'max:20'],
            'address'                  => ['nullable', 'string'],
            'gps_lat'                  => ['nullable', 'numeric'],
            'gps_lng'                  => ['nullable', 'numeric'],
            'username'                 => ['required', 'min:6', 'max:55', Rule::unique('tbl_users', 'username')],
            'password'                 => ['required', 'min:6', 'max:20', 'confirmed'],
            'password_confirmation'    => ['required', 'min:6', 'max:20'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        if ($request->hasFile('add_user_profile_picture')) {
            $filenameWithExtensions = $request->file('add_user_profile_picture');
            $filename               = pathinfo($filenameWithExtensions, PATHINFO_FILENAME);
            $extension              = $filenameWithExtensions->getClientOriginalExtension();
            $filenameToStore        = sha1($filename . '_' . time() . '.' . $extension);
            $filenameWithExtensions->storeAs('public/img/user/profile_picture', $filenameToStore);
            $validated['add_user_profile_picture'] = $filenameToStore;
        }

        $age = date_diff(date_create($validated['birth_date']), date_create('now'))->y;

        User::create([
            'profile_picture' => $validated['add_user_profile_picture'] ?? null,
            'first_name'      => $validated['first_name'],
            'middle_name'     => $validated['middle_name'] ?? null,
            'last_name'       => $validated['last_name'],
            'suffix_name'     => $validated['suffix_name'] ?? null,
            'role'            => $validated['role'],
            'birth_date'      => $validated['birth_date'],
            'age'             => $age,
            'contact_number'  => $validated['contact_number'] ?? null,
            'address'         => $validated['address'] ?? null,
            'gps_lat'         => $validated['gps_lat'] ?? null,
            'gps_lng'         => $validated['gps_lng'] ?? null,
            'username'        => $validated['username'],
            'password'        => $validated['password'],
        ]);

        return response()->json([
            'message' => 'User Successfully Saved.'
        ], 200);
    }

    public function updateUser(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'edit_user_profile_picture' => ['nullable', 'image', 'mimes:png,jpg,jpeg'],
            'first_name'                => ['required', 'max:55'],
            'middle_name'               => ['nullable', 'max:55'],
            'last_name'                 => ['required', 'max:55'],
            'suffix_name'               => ['nullable', 'max:20'],
            'role'                      => ['required', Rule::in(['admin', 'staff', 'rider', 'customer'])],
            'birth_date'                => ['required', 'date', 'before:today'],
            'contact_number'            => ['nullable', 'max:20'],
            'address'                   => ['nullable', 'string'],
            'gps_lat'                   => ['nullable', 'numeric'],
            'gps_lng'                   => ['nullable', 'numeric'],
            'username'                  => [
                'required', 'min:6', 'max:55',
                Rule::unique('tbl_users', 'username')->ignore($user),
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        if ($request->has('remove_profile_picture') && $request->remove_profile_picture == '1') {
            if ($user->profile_picture && Storage::exists('public/img/user/profile_picture/' . $user->profile_picture)) {
                Storage::delete('public/img/user/profile_picture/' . $user->profile_picture);
            }
            $user->profile_picture = null;
        } elseif ($request->hasFile('edit_user_profile_picture')) {
            if ($user->profile_picture && Storage::exists('public/img/user/profile_picture/' . $user->profile_picture)) {
                Storage::delete('public/img/user/profile_picture/' . $user->profile_picture);
            }

            $filenameWithExtensions = $request->file('edit_user_profile_picture');
            $filename               = pathinfo($filenameWithExtensions, PATHINFO_FILENAME);
            $extension              = $filenameWithExtensions->getClientOriginalExtension();
            $filenameToStore        = sha1($filename . '_' . time() . '.' . $extension);
            $filenameWithExtensions->storeAs('public/img/user/profile_picture', $filenameToStore);
            $validated['edit_user_profile_picture'] = $filenameToStore;
        }

        $age = date_diff(date_create($validated['birth_date']), date_create('now'))->y;

        $user->update([
            'profile_picture' => $validated['edit_user_profile_picture'] ?? $user->profile_picture,
            'first_name'      => $validated['first_name'],
            'middle_name'     => $validated['middle_name'] ?? null,
            'last_name'       => $validated['last_name'],
            'suffix_name'     => $validated['suffix_name'] ?? null,
            'role'            => $validated['role'],
            'birth_date'      => $validated['birth_date'],
            'age'             => $age,
            'contact_number'  => $validated['contact_number'] ?? null,
            'address'         => $validated['address'] ?? null,
            'gps_lat'         => $validated['gps_lat'] ?? null,
            'gps_lng'         => $validated['gps_lng'] ?? null,
            'username'        => $validated['username'],
        ]);

        $user->profile_picture = $user->profile_picture
            ? url('storage/public/img/user/profile_picture/' . $user->profile_picture)
            : null;

        return response()->json([
            'message' => 'User Successfully Updated.',
            'user'    => $user
        ], 200);
    }

    public function updateStatus(User $user)
    {
        $user->update([
            'is_active' => !$user->is_active
        ]);

        return response()->json([
            'message'   => 'User Status Updated.',
            'is_active' => $user->is_active
        ], 200);
    }

    public function destroyUser(User $user)
    {
        $user->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'User Successfully Deleted.'
        ], 200);
    }
}
