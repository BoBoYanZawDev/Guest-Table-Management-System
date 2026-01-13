<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Services\UserService;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    protected $userService;
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $users =  $this->userService->list($request);
        return inertia('Admin/User/UserIndex', [
            'users' => $users,
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|string|email|max:255|unique:users',
            'loginid' => 'required|string|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        [$status, $message] =  $this->userService->storeData($request);

        return redirect()->back()->with($status, $message);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['nullable', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'loginid' => ['required', Rule::unique('users', 'loginid')->ignore($user->id)],
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        [$status, $message] =  $this->userService->updateData($user, $request);

        return redirect()->back()->with($status, $message);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        [$status, $message] =  $this->userService->deleteData($user);
        return redirect()->back()->with($status, $message);
    }
}
