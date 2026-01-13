import CustomModal from "@/Components/Modal";
import { Head, router, useForm } from "@inertiajs/react";
import { Empty, Pagination, Select, Upload } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Popconfirm, Button } from "antd";
import {
    DownloadOutlined,
} from "@ant-design/icons";
import { formatDate } from "@/Utils/format";
import FlashMessage from "@/Components/FlashMessage";
import { Edit2, Trash2 } from "lucide-react";

function GuestIndex({ guests, tables }) {
    const guestData = guests.data;
    const initialFilters = new URL(window.location.href).searchParams;
    const [search, setSearch] = useState(initialFilters.get("search") || "");
    const [tableId, setTableId] = useState(
        initialFilters.get("table_id") || ""
    );
    const tableOptions = useMemo(
        () =>
            tables.map((t) => ({
                value: t.id,
                label: t.name,
            })),
        [tables]
    );

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const currentUrl = new URL(window.location.href);
            const currentSearch = currentUrl.searchParams.get("search") || "";
            const nextSearch = search.trim();
            const currentTableId =
                currentUrl.searchParams.get("table_id") || "";
            const nextTableId = tableId || "";

            if (
                nextSearch === currentSearch.trim() &&
                nextTableId === currentTableId
            )
                return;

            const params = {};
            if (nextSearch !== "") params.search = nextSearch;
            if (nextTableId !== "") params.table_id = nextTableId;

            router.get(route("guests.index"), params, {
                preserveState: true,
                replace: true,
            });
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [search, tableId]);

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
        table_id: "",
        seat_no: "",
        checked_in: false,
    });

    const {
        data: importData,
        setData: setImportData,
        post: importPost,
        processing: importProcessing,
        reset: resetImport,
    } = useForm({
        file: null,
    });
    const [importFileList, setImportFileList] = useState([]);

    const [createModal, setCreateModal] = useState(false);
    const [editingGuest, setEditingGuest] = useState(null);

    const closeModal = () => {
        setCreateModal(false);
        setTimeout(() => {
            setEditingGuest(null);
        }, 100);
        resetAndClearErrors();
    };

    useEffect(() => {
        if (editingGuest) {
            setData({
                name: editingGuest.name,
                table_id: editingGuest.table_id,
                seat_no: editingGuest.seat_no ?? "",
                checked_in: !!editingGuest.checked_in,
            });
        } else {
            resetAndClearErrors();
        }
    }, [editingGuest]);

    const saveGuest = (e) => {
        e.preventDefault();

        if (editingGuest) {
            put(route("guests.update", editingGuest.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route("guests.store"), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const pageChange = (page) => {
        router.get(
            route("guests.index"),
            { page, search, table_id: tableId || undefined },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            }
        );
    };

    const deleteConfirm = (id) => {
        destroy(route("guests.destroy", id));
    };

    const submitImport = (e) => {
        e.preventDefault();
        if (!importData.file) return;
        importPost(route("guests.import"), {
            forceFormData: true,
            onSuccess: () => {
                resetImport();
                setImportFileList([]);
            },
        });
    };

    return (
        <>
            <Head title="Guests" />
            <FlashMessage />
            <CustomModal show={createModal} maxWidth="sm" onClose={closeModal}>
                <div className="px-4 pt-4">
                    <form onSubmit={saveGuest}>
                        <header className="text-lg font-medium text-gray-900 dark:text-slate-100">
                            {editingGuest ? "Edit Guest" : "Create Guest"}
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
                                        htmlFor="table_id"
                                        className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                                    >
                                        Table
                                    </label>
                                    <select
                                        id="table_id"
                                        name="table_id"
                                        value={data.table_id}
                                        onChange={(e) =>
                                            setData("table_id", e.target.value)
                                        }
                                        className="mt-1 block w-full border border-gray-300 dark:border-slate-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                                        required
                                    >
                                        <option value="">Select Table</option>
                                        {tables.map((t) => (
                                            <option key={t.id} value={t.id}>
                                                {t.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.table_id && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.table_id}
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <div className="mt-4">
                                    <label
                                        htmlFor="seat_no"
                                        className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                                    >
                                        Seat No
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        name="seat_no"
                                        id="seat_no"
                                        placeholder="Seat number"
                                        value={data.seat_no ?? ""}
                                        onChange={(e) =>
                                            setData(
                                                "seat_no",
                                                e.target.value === ""
                                                    ? ""
                                                    : Number(e.target.value)
                                            )
                                        }
                                        className="mt-1 block w-full border border-gray-300 dark:border-slate-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                                    />
                                </div>
                                {errors.seat_no && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.seat_no}
                                    </div>
                                )}
                            </div>
                            <label className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300">
                                <input
                                    type="checkbox"
                                    checked={!!data.checked_in}
                                    onChange={(e) =>
                                        setData("checked_in", e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                Checked in
                            </label>
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
                                    : editingGuest
                                    ? "Update"
                                    : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            </CustomModal>

            <h3 className="text-xl font-bold mb-3 dark:text-white">Guests</h3>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 sm:p-6 text-gray-900 dark:text-slate-100">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-3 items-center">
                        <input
                            type="text"
                            placeholder="Search ..."
                            className="block w-full sm:w-64 border border-gray-300 dark:border-slate-700 rounded-md shadow-sm py-1 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Select
                            allowClear
                            placeholder="Filter by table"
                            className="min-w-[180px]"
                            options={tableOptions}
                            value={tableId || undefined}
                            onChange={(value) => setTableId(value || "")}
                            optionFilterProp="label"
                            showSearch
                        />
                        <form
                            onSubmit={submitImport}
                            className="flex items-center gap-2"
                        >
                            <Upload
                                beforeUpload={() => false}
                                accept=".xlsx,.xls,.csv"
                                fileList={importFileList}
                                maxCount={1}
                                onChange={({ fileList }) => {
                                    const nextFile =
                                        fileList[0]?.originFileObj || null;
                                    setImportFileList(fileList);
                                    setImportData("file", nextFile);
                                }}
                            >
                                <Button>Choose File</Button>
                            </Upload>
                            <Button
                                htmlType="submit"
                                disabled={!importData.file || importProcessing}
                            >
                                {importProcessing ? "Importing..." : "Import"}
                            </Button>
                            <Button
                                icon={<DownloadOutlined />}
                                block
                                href="/import_template.xlsx"
                            >
                                Download Template
                            </Button>
                        </form>
                    </div>
                    <div className="text-right">
                        <button
                            type="button"
                            className="btn-primary"
                            onClick={() => {
                                setEditingGuest(null);
                                setCreateModal(true);
                            }}
                        >
                            Add
                        </button>
                    </div>
                </div>
                <small className="text-xs text-slate-700 mb-4">
                    Total - {guests.total}
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
                                    Table
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                                    Seat No
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                                    Checked In
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                                    Source
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
                            {guestData && guestData.length > 0 ? (
                                guestData.map((g, index) => (
                                    <tr
                                        key={g.id}
                                        className="hover:bg-gray-50 dark:hover:bg-slate-900"
                                    >
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-slate-200">
                                            {(guests.from ?? 0) + index}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">
                                            {g.name}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">
                                            {g.table?.name || "-"}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">
                                            {g.seat_no ?? "-"}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                    g.checked_in
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-amber-100 text-amber-700"
                                                }`}
                                            >
                                                {g.checked_in
                                                    ? "Present"
                                                    : "Not Yet"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            {g.source ?? "-"}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                                            {formatDate(g.created_at)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                                            <Button
                                                color="primary"
                                                variant="outlined"
                                                className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-slate-700 rounded-lg transition-all border border-blue-200 dark:border-slate-600 me-2"
                                                onClick={() => {
                                                    setEditingGuest(g);
                                                    setCreateModal(true);
                                                }}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Popconfirm
                                                title="Delete"
                                                description="Are you sure to delete ?"
                                                onConfirm={() =>
                                                    deleteConfirm(g.id)
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
                                    <td colSpan="8" className="text-center">
                                        <Empty
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {guests && guests.total > 10 && (
                        <div className="mt-4 flex justify-center">
                            <Pagination
                                total={guests.total}
                                current={guests.current_page}
                                pageSize={guests.per_page}
                                onChange={pageChange}
                                showSizeChanger={false}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default GuestIndex;
