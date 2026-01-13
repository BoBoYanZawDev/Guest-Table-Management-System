

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center  pt-6 justify-center sm:pt-0 bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50">
            {children}
        </div>
    );
}
