import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import FlashMessage from "@/Components/FlashMessage";
import { Image, Switch, Upload } from "antd";
import { handlePreview } from "@/Utils/format";

function SettingIndex({ setting }) {
    // console.log("Setting:", setting);
    // useForm hook
    const { data, setData, post, processing, errors, transform } = useForm({
        company_name: "",
        compnay_desc: "",
        logo: null,
        address: "",
        phone: "",
        bot_token: "",
        chat_id: "",
        is_show_sub_cat: 0,
    });
    const editingSetting = setting;
    const [isLocked, setIsLocked] = useState(true);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [logoFileList, setLogoFileList] = useState([]);

    // Prefill when editing
    useEffect(() => {
        if (editingSetting) {
            setData({
                company_name: editingSetting.company_name || "",
                compnay_desc: editingSetting.compnay_desc || "",
                logo: null,
                address: editingSetting.address || "",
                phone: editingSetting.phone || "",
                bot_token: editingSetting.bot_token || "",
                chat_id: editingSetting.chat_id || "",
                is_show_sub_cat: editingSetting.is_show_sub_cat || 0,
            });
            if (editingSetting.logo && editingSetting.logo !== "-") {
                setLogoFileList([
                    {
                        uid: "-1",
                        name: "logo",
                        status: "done",
                        url: editingSetting.logo,
                    },
                ]);
            } else {
                setLogoFileList([]);
            }
            setPreviewOpen(false);
            setPreviewImage("");
        }
    }, [editingSetting]);

    const handleLogoChange = ({ fileList: nextList }) => {
        const nextFile = nextList[0]?.originFileObj;
        setLogoFileList(nextList);
        setData("logo", nextFile || null);
    };

    // Create or update brand
    const saveSetting = (e) => {
        e.preventDefault();

        if (isLocked) return;
        if (!editingSetting?.id) return;
        // Edit Mode
        transform((formData) => ({
            ...formData,
            _method: "put",
        }));
        post(route("settings.update", editingSetting.id), {
            forceFormData: true,
            onSuccess: () => {
                transform((formData) => {
                    const { _method, ...rest } = formData;
                    return rest;
                });
            },
        });
    };

    return (
        <>
            <Head title="Setting" />
            <FlashMessage />
            <h3 className="text-xl font-bold mb-3 dark:text-white">Setting</h3>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 sm:p-6 text-gray-900 dark:text-slate-100">
                <form onSubmit={saveSetting}>
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="button"
                            className="btn-primary bg-gray-200 text-gray-800 hover:bg-gray-300"
                            onClick={() => setIsLocked((prev) => !prev)}
                        >
                            {isLocked ? "Unlock" : "Lock"}
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isLocked || processing}
                        >
                            {processing ? "Updating..." : "Update"}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2 flex gap-10 items-end h-100">
                            <div className="min-h-100 min-w-24">
                                <label
                                    htmlFor="logo"
                                    className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                                >
                                    Logo
                                </label>
                                <Upload
                                    id="logo"
                                    listType="picture-card"
                                    fileList={logoFileList}
                                    maxCount={1}
                                    accept="image/*"
                                    beforeUpload={() => false}
                                    onPreview={handlePreview}
                                    onChange={handleLogoChange}
                                    disabled={isLocked}
                                >
                                    {logoFileList.length >= 1 ? null : "Upload"}
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
                                                !visible && setPreviewImage(""),
                                        }}
                                        src={previewImage}
                                    />
                                )}
                                {errors.logo && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.logo}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="logo_alt_text"
                                    className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                                >
                                    Show Sub Category
                                </label>
                                <Switch
                                    disabled={isLocked}
                                    checked={data.is_show_sub_cat == 1}
                                    onChange={(checked) =>
                                        setData(
                                            "is_show_sub_cat",
                                            checked ? 1 : 0
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="company_name"
                                className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                            >
                                Company Name
                            </label>
                            <input
                                type="text"
                                name="company_name"
                                id="company_name"
                                placeholder="Enter Company Name"
                                value={data.company_name}
                                onChange={(e) =>
                                    setData("company_name", e.target.value)
                                }
                                className="mt-1 block w-full border border-gray-300 dark:border-slate-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                                disabled={isLocked}
                                autoComplete="off"
                            />
                            {errors.company_name && (
                                <div className="text-red-500 text-sm mt-1">
                                    {errors.company_name}
                                </div>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                            >
                                Phone
                            </label>
                            <input
                                type="text"
                                name="phone"
                                id="phone"
                                placeholder="Enter Phone"
                                value={data.phone}
                                onChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                                className="mt-1 block w-full border border-gray-300 dark:border-slate-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                                disabled={isLocked}
                                autoComplete="off"
                            />
                            {errors.phone && (
                                <div className="text-red-500 text-sm mt-1">
                                    {errors.phone}
                                </div>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="bot_token"
                                className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                            >
                                Bot Token
                            </label>
                            <input
                                type="text"
                                name="bot_token"
                                id="bot_token"
                                placeholder="Enter Bot Token"
                                value={data.bot_token}
                                onChange={(e) =>
                                    setData("bot_token", e.target.value)
                                }
                                className="mt-1 block w-full border border-gray-300 dark:border-slate-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                                disabled={isLocked}
                                autoComplete="off"
                            />
                            {errors.bot_token && (
                                <div className="text-red-500 text-sm mt-1">
                                    {errors.bot_token}
                                </div>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="chat_id"
                                className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                            >
                                Chat ID
                            </label>
                            <input
                                type="text"
                                name="chat_id"
                                id="chat_id"
                                placeholder="Enter Chat ID"
                                value={data.chat_id}
                                onChange={(e) =>
                                    setData("chat_id", e.target.value)
                                }
                                className="mt-1 block w-full border border-gray-300 dark:border-slate-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                                disabled={isLocked}
                                autoComplete="off"
                            />
                            {errors.chat_id && (
                                <div className="text-red-500 text-sm mt-1">
                                    {errors.chat_id}
                                </div>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <label
                                htmlFor="address"
                                className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                            >
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                id="address"
                                placeholder="Enter Address"
                                value={data.address}
                                onChange={(e) =>
                                    setData("address", e.target.value)
                                }
                                className="mt-1 block w-full border border-gray-300 dark:border-slate-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                                disabled={isLocked}
                                autoComplete="off"
                            />
                            {errors.address && (
                                <div className="text-red-500 text-sm mt-1">
                                    {errors.address}
                                </div>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <label
                                htmlFor="compnay_desc"
                                className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                            >
                                Company Description
                            </label>
                            <textarea
                                name="compnay_desc"
                                id="compnay_desc"
                                rows="4"
                                placeholder="Enter Company Description"
                                value={data.compnay_desc}
                                onChange={(e) =>
                                    setData("compnay_desc", e.target.value)
                                }
                                className="mt-1 block w-full border border-gray-300 dark:border-slate-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                                disabled={isLocked}
                            />
                            {errors.compnay_desc && (
                                <div className="text-red-500 text-sm mt-1">
                                    {errors.compnay_desc}
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default SettingIndex;
