<?php

namespace App\Http\Controllers;

use App\Models\User;
use Hashids\Hashids;
use Illuminate\Http\Request;
use App\Services\DeptService;
use App\Services\UserService;
use App\Services\BranchService;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

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
        $branches = BranchService::list(null, false);
        $departments = DeptService::list(null, false);
        return inertia('Admin/User/UserIndex', [
            'users' => $users,
            'branches' => $branches,
            'departments' => $departments,
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
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
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'loginid' => ['required', Rule::unique('users', 'loginid')->ignore($user->id)],
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        [$status, $message] =  $this->userService->updateData($user, $request);

        return redirect()->back()->with($status, $message);
    }

    public function generate($id)
    {
        // Download the QR code
        $path = $this->userService->generateQr($id);
        return response()->download($path);
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
