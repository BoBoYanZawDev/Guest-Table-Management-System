<?php

namespace App\Services;

use Exception;
use App\Models\User;
use Hashids\Hashids;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class UserService
{
    /**
     * Display a listing of the resource.
     */
    public static function list($request, $paginate = true)
    {
        $users = User::where('is_active', 1);

        if ($request->has('search') && !empty($request->search)) {
            $users = $users->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('loginid', 'like', '%' . $request->search . '%');
        }
        if ($paginate) {
            $users = $users->paginate(10)->withQueryString();
        } else {
            $users = $users->get();
        }
        return $users;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function storeData($request)
    {
        try {
            $path = null;
            if ($request->hasFile('photo')) {
                $photo = request('photo');
                $path = '/storage/' . $photo->store('photo');
            }

            User::create([
                'name' => $request->name,
                'loginid' => $request->loginid,
                'email' => $request->email,
                'password' => $request->password,
            ]);
            return ['success', 'User created successfully.'];
        } catch (Exception $e) {
            dd($e->getMessage());
            return ['error', 'Something went wrong.'];
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function updateData($user, $request)
    {
        try {
            $password = $request->password ? bcrypt($request->password) : $user->password;

            $user->update([
                'name' => $request->name,
                'loginid' => $request->loginid,
                'email' => $request->email,
                'password' => $password,
            ]);
            return ['success', 'User updated successfully.'];
        } catch (Exception $e) {
            return ['error', 'Something went wrong.'];
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function deleteData($user)
    {
        try {
            $user->update([
                'is_active' => 0
            ]);
            return ['success', 'User Deleted Successfully.'];
        } catch (Exception $e) {
            return ['error', 'User went wrong.'];
        }
    }
}
