import CustomModal from "@/Components/Modal";
import { Head, router, useForm } from "@inertiajs/react";
import { Empty, Image, Input, Pagination, Select, Upload } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Popconfirm, Button } from "antd";
import { formatDate, handlePreview, userRole } from "@/Utils/format";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import FlashMessage from "@/Components/FlashMessage";
import { Edit2, QrCode, Trash2 } from "lucide-react";

function UserIndex({ users, branches, departments }) {
    const brandData = users.data;
    const [search, setSearch] = useState("");
    const rolesMemo = useMemo(() => userRole(), []);
    const [roles, setRoles] = useState([]);

    const branchOption = branches.map((c) => ({
        value: c.id,
        label: c.branch_name,
    }));

    const deptOption = departments.map((c) => ({
        value: c.id,
        label: c.dept_name,
    }));

    useEffect(() => {
        setRoles(rolesMemo);
    }, [rolesMemo]);

    const options = roles.map((c) => ({
        value: c,
        label: c,
    }));

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const currentUrl = new URL(window.location.href);
            const currentSearch = currentUrl.searchParams.get("search") || "";

            if (search.trim() === currentSearch.trim()) return;

            if (search.trim() === "") {
                router.get(route("users.index"), {}, { replace: true });
            } else {
                router.get(
                    route("users.index"),
                    { search },
                    { preserveState: true, replace: true }
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
        transform,
    } = useForm({
        name: "",
        email: "",
        role: null,
        loginid: null,
        branch_id: null,
        dept_id: null,
    });

    // Modal state
    const [createModal, setCreateModal] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [fileList, setFileList] = useState([]);

    const closeModal = () => {
        setCreateModal(false);
        setTimeout(() => {
            setEditingBrand(null);
        }, 100);
        setPreviewOpen(false);
        setPreviewImage("");
        setFileList([]);
        resetAndClearErrors();
    };
    // Prefill when editing
    useEffect(() => {
        if (editingBrand) {
            setData((prev) => ({
                ...prev,
                name: editingBrand.name,
                email: editingBrand.email,
                role: editingBrand.role,
                loginid: editingBrand.loginid,
                branch_id: editingBrand.branch_id,
                dept_id: editingBrand.dept_id,
            }));
            if (editingBrand.photo) {
                setFileList([
                    {
                        uid: "-1",
                        name: "photo",
                        status: "done",
                        url: editingBrand.photo,
                    },
                ]);
            } else {
                setFileList([]);
            }
            setPreviewImage("");
            setPreviewOpen(false);
        } else {
            resetAndClearErrors();
            setFileList([]);
            setPreviewImage("");
            setPreviewOpen(false);
        }
    }, [editingBrand]);

    const handleChange = ({ fileList: nextList }) => {
        const nextFile = nextList[0]?.originFileObj;
        setFileList(nextList);
        if (nextFile) {
            setData((prev) => ({
                ...prev,
                photo: nextFile,
            }));
        } else {
            setData((prev) => ({
                ...prev,
                photo: null,
            }));
        }
    };

    // Create or update brand
    const saveBrand = (e) => {
        e.preventDefault();
        if (editingBrand) {
            transform((formData) => ({
                ...formData,
                _method: "put",
            }));
            post(route("users.update", editingBrand.id), {
                forceFormData: true,
                onSuccess: () => {
                    transform((formData) => {
                        const { _method, ...rest } = formData;
                        return rest;
                    });
                    closeModal();
                },
            });
        } else {
            // Create Mode
            post(route("users.store"), {
                onSuccess: () => {
                    closeModal();
                },
            });
        }
    };

    // for paginate
    const pageChange = (page) => {
        router.get(
            route("users.index"),
            { page, search },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            }
        );
    };
    const deleteConfirm = (id) => {
        destroy(route("users.destroy", id));
    };

    const downloadQr = (id) => {
        window.location.href = route("users.qr.generate", id);
    };

    return (
        <>
            <Head title="User" />
            <FlashMessage />
            {/* for modal */}
            <CustomModal show={createModal} maxWidth="lg" onClose={closeModal}>
                <div className="px-4 pt-4">
                    <form onSubmit={saveBrand}>
                        <header className="text-lg font-medium text-gray-900 dark:text-slate-100">
                            {editingBrand ? "Edit User" : "Create User"}
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
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder="Enter Email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className="mt-1 block w-full border border-gray-300 dark:border-slate-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                                    />
                                </div>
                                {errors.email && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.email}
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <div className="mt-4">
                                    <label
                                        htmlFor="loginid"
                                        className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                                    >
                                        Login ID
                                    </label>
                                    <input
                                        type="text"
                                        name="loginid"
                                        id="loginid"
                                        placeholder="Enter Login ID"
                                        value={data.loginid}
                                        onChange={(e) =>
                                            setData("loginid", e.target.value)
                                        }
                                        className="mt-1 block w-full border border-gray-300 dark:border-slate-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                                    />
                                </div>
                                {errors.loginid && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.loginid}
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <div className="mt-4">
                                    <label
                                        htmlFor="role"
                                        className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                                    >
                                        Role
                                    </label>
                                    <Select
                                        name="role"
                                        allowClear
                                        autoClearSearchValue={true}
                                        showSearch
                                        style={{ width: "100%" }}
                                        placeholder="Select Role"
                                        optionFilterProp="label"
                                        filterSort={(a, b) =>
                                            a.label
                                                .toLowerCase()
                                                .localeCompare(
                                                    b.label.toLowerCase()
                                                )
                                        }
                                        options={options}
                                        value={data.role}
                                        onChange={(value) =>
                                            setData("role", value)
                                        }
                                    />
                                </div>

                                {errors.role && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.role}
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="form-group">
                                    <div className="mt-4">
                                        <label
                                            htmlFor="branch_id"
                                            className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                                        >
                                            Branch
                                        </label>
                                        <Select
                                            name="branch_id"
                                            allowClear
                                            autoClearSearchValue={true}
                                            showSearch
                                            style={{ width: "100%" }}
                                            placeholder="Select Branch"
                                            optionFilterProp="label"
                                            filterSort={(a, b) =>
                                                a.label
                                                    .toLowerCase()
                                                    .localeCompare(
                                                        b.label.toLowerCase()
                                                    )
                                            }
                                            options={branchOption}
                                            value={data.branch_id}
                                            onChange={(value) =>
                                                setData("branch_id", value)
                                            }
                                        />
                                    </div>

                                    {errors.branch_id && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {errors.branch_id}
                                        </div>
                                    )}
                                </div>
                                <div className="form-group">
                                    <div className="mt-4">
                                        <label
                                            htmlFor="dept_id"
                                            className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                                        >
                                            Department
                                        </label>
                                        <Select
                                            name="dept_id"
                                            allowClear
                                            autoClearSearchValue={true}
                                            showSearch
                                            style={{ width: "100%" }}
                                            placeholder="Select Department"
                                            optionFilterProp="label"
                                            filterSort={(a, b) =>
                                                a.label
                                                    .toLowerCase()
                                                    .localeCompare(
                                                        b.label.toLowerCase()
                                                    )
                                            }
                                            options={deptOption}
                                            value={data.dept_id}
                                            onChange={(value) =>
                                                setData("dept_id", value)
                                            }
                                        />
                                    </div>

                                    {errors.role && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {errors.role}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="mt-4">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                                    >
                                        Password{" "}
                                        {editingBrand && (
                                            <small>
                                                (Leave blank to keep current
                                                password)
                                            </small>
                                        )}
                                    </label>
                                    <Input.Password
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        name="password"
                                        id="password"
                                        placeholder="Enter password"
                                        iconRender={(visible) =>
                                            visible ? (
                                                <EyeTwoTone />
                                            ) : (
                                                <EyeInvisibleOutlined />
                                            )
                                        }
                                    />
                                </div>
                                {errors.password && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.password}
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <div className="mt-4">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                                    >
                                        Confirm Password
                                    </label>
                                    <Input.Password
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        name="password_confirmation"
                                        id="password_confirmation"
                                        placeholder="Enter password"
                                        iconRender={(visible) =>
                                            visible ? (
                                                <EyeTwoTone />
                                            ) : (
                                                <EyeInvisibleOutlined />
                                            )
                                        }
                                    />
                                </div>
                                {errors.password_confirmation && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.password_confirmation}
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <div className="mt-4">
                                    <label
                                        htmlFor="cat_photo"
                                        className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                                    >
                                        Image{" "}
                                        <small className="text-xs">
                                            (optional)
                                        </small>
                                    </label>
                                    <Upload
                                        id="photo"
                                        listType="picture-card"
                                        fileList={fileList}
                                        maxCount={1}
                                        accept="image/*"
                                        beforeUpload={() => false}
                                        onPreview={handlePreview}
                                        onChange={handleChange}
                                    >
                                        {fileList.length >= 1 ? null : "Upload"}
                                    </Upload>
                                    {previewImage && (
                                        <Image
                                            styles={{
                                                root: { display: "none" },
                                            }}
                                            preview={{
                                                open: previewOpen,
                                                onOpenChange: (visible) =>
                                                    setPreviewOpen(visible),
                                                afterOpenChange: (visible) =>
                                                    !visible &&
                                                    setPreviewImage(""),
                                            }}
                                            src={previewImage}
                                        />
                                    )}
                                </div>
                                {errors.photo && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.photo}
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
                            <button type="submit" className="btn-primary">
                                {processing
                                    ? "Saving..."
                                    : editingBrand
                                    ? "Update"
                                    : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            </CustomModal>

            <h3 className="text-xl font-bold mb-3 dark:text-white">Users</h3>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 sm:p-6 text-gray-900 dark:text-slate-100">
                <div className="flex justify-between align-center">
                    <div>
                        <input
                            type="text"
                            placeholder="Search ..."
                            className="mt-1 block w-full border border-gray-300 dark:border-slate-700 rounded-md shadow-sm py-1 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="text-right">
                        <button
                            type="button"
                            className="btn-primary"
                            onClick={() => {
                                setEditingBrand(null);
                                setCreateModal(true);
                                resetAndClearErrors();
                            }}
                        >
                            Add
                        </button>
                    </div>
                </div>
                <small className="text-xs text-slate-700 mb-4">
                    {" "}
                    Total - {users.total}
                </small>
                <div className="overflow-x-auto overflow-y-hidden -mx-4 sm:mx-0 ">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                        <thead className="bg-gray-100 dark:bg-slate-900">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                                    No
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                                    Photo
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                                    Login ID
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                                    Branch
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                                    Department
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                                    Role
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
                            {brandData && brandData.length > 0 ? (
                                brandData.map((b, index) => (
                                    <tr
                                        key={b.id}
                                        className="hover:bg-gray-50 dark:hover:bg-slate-900"
                                    >
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-slate-200">
                                            {(users.from ?? 0) + index}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">
                                            <Image
                                                style={{ borderRadius: 8 }}
                                                width={60}
                                                alt="basic"
                                                src={b.photo}
                                                fallback="data:image/png;base64,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"
                                            />
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">
                                            {b.name}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">
                                            {b.loginid}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">
                                            {b.email || "-"}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">
                                            {b.branch_name || "-"}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">
                                            {b.dept_name || "-"}
                                        </td>
                                        <td className="capitalize px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">
                                            {b.role ?? "-"}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                                            {formatDate(b.created_at)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                                            <Button
                                                color="purple"
                                                variant="outlined"
                                                className="text-xs btn py-1 mr-2 bg-blue-500"
                                                onClick={() => {
                                                    downloadQr(b.id);
                                                }}
                                            >
                                                <QrCode className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                color="primary"
                                                variant="outlined"
                                                className="text-xs btn py-1 mr-2 bg-blue-500"
                                                onClick={() => {
                                                    setEditingBrand(b);
                                                    setCreateModal(true);
                                                }}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>

                                            <Popconfirm
                                                title="Delete"
                                                description="Are you sure to delete ?"
                                                onConfirm={() =>
                                                    deleteConfirm(b.id)
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
                    {users && users.total > 10 && (
                        <div className="mt-4 flex justify-center">
                            <Pagination
                                total={users.total}
                                current={users.current_page}
                                pageSize={users.per_page}
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

export default UserIndex;
