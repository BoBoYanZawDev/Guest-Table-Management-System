import CustomModal from "@/Components/Modal";
import { Head, router, useForm } from "@inertiajs/react";
import { Empty, Pagination } from "antd";
import { useEffect, useState } from "react";
import { Popconfirm, Button } from "antd";
import { formatDate } from "@/Utils/format";
import FlashMessage from "@/Components/FlashMessage";
import { Edit2, Trash2 } from "lucide-react";

function GuestTableIndex({ tables }) {
    const tableData = tables.data;
    const initialFilters = new URL(window.location.href).searchParams;
    const [search, setSearch] = useState(initialFilters.get("search") || "");

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const currentUrl = new URL(window.location.href);
            const currentSearch = currentUrl.searchParams.get("search") || "";
            const nextSearch = search.trim();

            if (nextSearch === currentSearch.trim()) return;

            if (nextSearch === "") {
                router.get(route("guest_tables.index"), {}, { replace: true });
            } else {
                router.get(
                    route("guest_tables.index"),
                    { search: nextSearch },
                    {
                        preserveState: true,
                        replace: true,
                    }
                );
            }
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [search]);

    // useForm hook
    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        resetAndClearErrors,
    } = useForm({
        name: "",
        capacity: 10,
    });

    // Modal state
    const [createModal, setCreateModal] = useState(false);
    const [editingTable, setEditingTable] = useState(null);

    const closeModal = () => {
        setCreateModal(false);
        setTimeout(() => {
            setEditingTable(null);
        }, 100);
        resetAndClearErrors();
    };

    // Prefill when editing
    useEffect(() => {
        if (editingTable) {
            setData({
                name: editingTable.name,
                capacity: editingTable.capacity,
            });
        } else {
            resetAndClearErrors();
        }
    }, [editingTable]);

    // Create or update guest table
    const saveTable = (e) => {
        e.preventDefault();

        if (editingTable) {
            // Edit Mode
            put(route("guest_tables.update", editingTable.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            // Create Mode
            post(route("guest_tables.store"), {
                onSuccess: () => closeModal(),
            });
        }
    };
    // for paginate
    const pageChange = (page) => {
        router.get(
            route("guest_tables.index"),
            { page, search },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            }
        );
    };
    const deleteConfirm = (id) => {
        destroy(route("guest_tables.destroy", id));
    };

    return (
        <>
            <Head title="Guest Table" />
            <FlashMessage />
            {/* for modal */}
            <CustomModal show={createModal} maxWidth="sm" onClose={closeModal}>
                <div className="px-4 pt-4">
                    <form onSubmit={saveTable}>
                        <header className="text-lg font-medium text-gray-900 dark:text-slate-100">
                            {editingTable
                                ? "Edit Guest Table"
                                : "Create Guest Table"}
                        </header>
                        <div className="card-body">
                            <div className="form-group">
                                <div className="mt-4">
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                                    >
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        placeholder="Enter Name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="mt-1 block w-full border border-gray-300 dark:border-slate-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                                        required
                                    />
                                </div>
                                {errors.name && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.name}
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <div className="mt-4">
                                    <label
                                        htmlFor="capacity"
                                        className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                                    >
                                        Capacity
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        name="capacity"
                                        id="capacity"
                                        placeholder="10"
                                        value={data.capacity ?? ""}
                                        onChange={(e) =>
                                            setData(
                                                "capacity",
                                                e.target.value === ""
                                                    ? null
                                                    : Number(e.target.value)
                                            )
                                        }
                                        className="mt-1 block w-full border border-gray-300 dark:border-slate-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                                    />
                                </div>
                                {errors.capacity && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.capacity}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                className="btn-primary bg-gray-300 text-gray-700 hover:bg-gray-400"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={processing}
                            >
                                {processing
                                    ? "Saving..."
                                    : editingTable
                                    ? "Update"
                                    : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            </CustomModal>
            <h3 className="text-xl font-bold mb-3 dark:text-white">
                Guest Tables
            </h3>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 sm:p-6 text-gray-900 dark:text-slate-100">
                <div className="flex justify-between  align-center mt-1">
                    <div className="flex gap-3 items-center ">
                        <div>
                            <input
                                type="text"
                                placeholder="Search ..."
                                className=" block w-full border border-gray-300 dark:border-slate-700 rounded-md shadow-sm py-1 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="text-right">
                        <button
                            type="button"
                            className="btn-primary"
                            onClick={() => {
                                setEditingTable(null);
                                setCreateModal(true);
                            }}
                        >
                            Add
                        </button>
                    </div>
                </div>
                <small className="text-xs text-slate-700 mb-4">
                    Total - {tables.total}
                </small>
                <div className="overflow-x-auto overflow-y-hidden -mx-4 sm:mx-0">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                        <thead className="bg-gray-100 dark:bg-slate-900">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                                    No
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                                    Capacity
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                            {tableData && tableData.length > 0 ? (
                                tableData.map((t, index) => (
                                    <tr
                                        key={t.id}
                                        className="hover:bg-gray-50 dark:hover:bg-slate-900"
                                    >
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-slate-200">
                                            {(tables.from ?? 0) + index}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">
                                            {t.name}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">
                                            {t.capacity}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                                            {formatDate(t.created_at)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                                            <Button
                                                color="primary"
                                                variant="outlined"
                                                className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-slate-700 rounded-lg transition-all border border-blue-200 dark:border-slate-600 me-2"
                                                onClick={() => {
                                                    setEditingTable(t);
                                                    setCreateModal(true);
                                                }}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Popconfirm
                                                title="Delete"
                                                description="Are you sure to delete ?"
                                                onConfirm={() =>
                                                    deleteConfirm(t.id)
                                                }
                                                okText="Yes"
                                                cancelText="No"
                                                placement="topLeft"
                                            >
                                                <Button
                                                    color="danger"
                                                    variant="outlined"
                                                    className="text-xs btn py-1"
                                                    danger
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </Popconfirm>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        <Empty
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {tables && tables.total > 10 && (
                        <div className="mt-4 flex justify-center">
                            <Pagination
                                total={tables.total}
                                current={tables.current_page}
                                pageSize={tables.per_page}
                                onChange={pageChange}
                                showSizeChanger={false} // hide "items per page" dropdown
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default GuestTableIndex;
