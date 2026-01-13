import { handlePreview } from "@/Utils/format";
import { Image, Upload } from "antd";
import React from "react";

function CompanyTab({
    data,
    setData,
    errors,
    isLocked,
    logoFileList,
    previewImage,
    previewOpen,
    setPreviewOpen,
    setPreviewImage,
    handleLogoChange,
}) {
    return (
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
                                root: {
                                    display: "none",
                                },
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
                    onChange={(e) => setData("company_name", e.target.value)}
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
                    onChange={(e) => setData("phone", e.target.value)}
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
                    onChange={(e) => setData("address", e.target.value)}
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
                    rows="2"
                    placeholder="Enter Company Description"
                    value={data.compnay_desc}
                    onChange={(e) => setData("compnay_desc", e.target.value)}
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
    );
}

export default CompanyTab;
