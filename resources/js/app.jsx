import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import AdminLayout from "./Layouts/AdminLayout";
import GuestLayout from "./Layouts/GuestLayout";
import PlaneLayout from "./Layouts/PlaneLayout";
import "./lib.jsx";

const appName = import.meta.env.VITE_APP_NAME || "Rating";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx");
        const page = await resolvePageComponent(`./Pages/${name}.jsx`, pages);

        const isAdminPage = name.startsWith("Admin/");
        const isFrontendPage = name.startsWith("Frontend/");

        page.default.layout =
            page.default.layout ||
            ((pageEl) =>
                isAdminPage ? (
                    <AdminLayout>{pageEl}</AdminLayout>
                ) : isFrontendPage ? (
                    <PlaneLayout>{pageEl}</PlaneLayout>
                ) : (
                    <GuestLayout>{pageEl}</GuestLayout>
                ));

        return page;
    },

    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
});
