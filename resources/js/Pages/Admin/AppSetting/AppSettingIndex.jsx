import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import FlashMessage from "@/Components/FlashMessage";
import { Tabs } from "antd";
import CompanyTab from "@/Components/AppSetting/CompanyTab";
import TelegramTab from "@/Components/AppSetting/TelegramTab";
import RatingHeaderTab from "@/Components/AppSetting/RatingHeaderTab";
import SettingTab from "@/Components/AppSetting/SettingTab";

function AppSettingIndex({ setting }) {
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
        category_header: "",
        subcategory_header: "",
        rating_header: "",
        is_show_sub_cat: 0,
        is_show_cat: 0,
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
                category_header: editingSetting.category_header || "",
                subcategory_header: editingSetting.subcategory_header || "",
                rating_header: editingSetting.rating_header || "",
                is_show_sub_cat: editingSetting.is_show_sub_cat || 0,
                is_show_cat: editingSetting.is_show_cat || 0,
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
        const settingId = 1;
        // Edit Mode
        transform((formData) => ({
            ...formData,
            _method: "put",
        }));
        post(route("app_settings.update", settingId), {
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
                    <div className="flex items-center justify-between mb-2">
                        <button
                            type="button"
                            className="btn-primary bg-gray-200 text-gray-800 hover:bg-gray-300"
                            onClick={() => setIsLocked((prev) => !prev)}
                        >
                            {isLocked ? "Unlock" : "Lock"}
                        </button>
                        {!isLocked && (
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={isLocked || processing}
                            >
                                {processing ? "Updating..." : "Update"}
                            </button>
                        )}
                    </div>

                    <Tabs
                        defaultActiveKey="company"
                        items={[
                            {
                                key: "company",
                                label: "Company Data",
                                children: (
                                    <CompanyTab
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                        isLocked={isLocked}
                                        logoFileList={logoFileList}
                                        previewImage={previewImage}
                                        previewOpen={previewOpen}
                                        setPreviewOpen={setPreviewOpen}
                                        setPreviewImage={setPreviewImage}
                                        handleLogoChange={handleLogoChange}
                                    />
                                ),
                            },
                            {
                                key: "telegram",
                                label: "Telegram Chat",
                                children: (
                                    <TelegramTab
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                        isLocked={isLocked}
                                    />
                                ),
                            },
                            {
                                key: "rating",
                                label: "Rating Header",
                                children: (
                                    <RatingHeaderTab
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                        isLocked={isLocked}
                                    />
                                ),
                            },
                            {
                                key: "setting",
                                label: "Setting",
                                children: (
                                    <SettingTab
                                        data={data}
                                        setData={setData}
                                        isLocked={isLocked}
                                    />
                                ),
                            },
                        ]}
                    />
                </form>
            </div>
        </>
    );
}

export default AppSettingIndex;
