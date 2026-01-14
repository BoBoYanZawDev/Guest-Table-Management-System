import ApplicationLogo from "@/Components/ApplicationLogo";
import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useState } from "react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    const [loaded, setLoaded] = useState(false);

    return (
        <>
            <Head title="Log in" />

            <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
                <div className="w-full max-w-4xl">
                    <div className="flex flex-col md:flex-row items-stretch bg-white rounded-3xl shadow-2xl overflow-hidden">
                        {/* Left Column: Login Form */}
                        <div className="w-full md:w-1/2 flex  flex-col justify-center  p-6 sm:p-8 md:p-10 lg:py-9 lg:px-14">
                            <div className="mb-4 mx-auto">
                                <Link
                                    href="/"
                                    className="inline-block transition-transform hover:scale-105"
                                >
                                    <ApplicationLogo className="h-auto lg:w-[45%] sm:w-[30%] sm:h-auto sm:w-50 fill-current text-blue-600" />
                                </Link>
                            </div>

                            <div className="mb-6">
                                <h2 className="text-2xl text-center font-extrabold text-gray-900 mb-2">
                                  Guest Table Management System
                                </h2>
                                <p className="text-gray-600 text-sm sm:text-base text-center">
                                    Sign in to your account to continue
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <InputLabel
                                        htmlFor="email"
                                        value="Email or Login ID"
                                        className="text-sm font-semibold text-gray-700 mb-1"
                                    />

                                    <TextInput
                                        placeholder="Enter your email or Login ID"
                                        id="email"
                                        type="text"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 py-2 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 placeholder:text-sm"
                                        autoComplete="username"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                    />
                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="password"
                                        value="Password"
                                        className="text-sm font-semibold text-gray-700 mb-1"
                                    />

                                    {/* <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        value={data.password}
                                        className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                                        autoComplete="current-password"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                    /> */}
                                    <Input.Password
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        name="password"
                                        id="password"
                                        autoComplete="current-password"
                                        className="mt-1 py-2 w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                                        placeholder="Enter password"
                                        iconRender={(visible) =>
                                            visible ? (
                                                <EyeTwoTone />
                                            ) : (
                                                <EyeInvisibleOutlined />
                                            )
                                        }
                                    />

                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center cursor-pointer group">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData(
                                                    "remember",
                                                    e.target.checked
                                                )
                                            }
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ms-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                            Remember me
                                        </span>
                                    </label>

                                    {/* {canResetPassword && (
                                        <Link
                                            href={route("password.request")}
                                            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                                        >
                                            Forgot password?
                                        </Link>
                                    )} */}
                                </div>

                                <div className="pt-2">
                                    <PrimaryButton
                                        className="w-full justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <span className="flex items-center justify-center">
                                                <svg
                                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Signing in...
                                            </span>
                                        ) : (
                                            "Log in"
                                        )}
                                    </PrimaryButton>
                                </div>
                            </form>

                            {status && (
                                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-sm font-medium text-green-800">
                                        {status}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Image - Hidden on small screens */}
                        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 items-center justify-center p-8 lg:p-9 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-indigo-400/10"></div>
                            <div className="relative z-10 w-full h-full flex items-center justify-center">
                                {!loaded && (
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-100 via-gray-200 to-gray-200 opacity-20 animate-pulse" />
                                )}
                                <img
                                    src="/login_icont.png"
                                    loading="eager"
                                    onLoad={() => setLoaded(true)}
                                    className={`max-w-full max-h-full object-contain drop-shadow-2xl lg:min-w-[300px]
                                                    transition-opacity duration-300 
                                                     ${
                                                         loaded
                                                             ? "opacity-100"
                                                             : "opacity-0"
                                                     }`}
                                />
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
