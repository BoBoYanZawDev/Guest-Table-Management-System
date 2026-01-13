import { Switch } from "antd";
import React from "react";

function SettingTab({ data, setData, isLocked }) {
    return (
        <div className="space-x-9 flex">
            <div className="flex items-center gap-4">
                <label
                    htmlFor="is_show_sub_cat"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                >
                    Show Category
                </label>
                <Switch
                    id="is_show_cat"
                    disabled={isLocked}
                    checked={data.is_show_cat == 1}
                    onChange={(checked) =>
                        {
                            const nextValue = checked ? 1 : 0;
                            setData("is_show_cat", nextValue);
                            if (!checked) {
                                setData("is_show_sub_cat", 0);
                            }
                        }
                    }
                />
            </div>

            <div className="flex items-center gap-4 ">
                <label
                    htmlFor="is_show_sub_cat"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                >
                    Show Sub Category
                </label>
                <Switch
                    id="is_show_sub_cat"
                    disabled={isLocked || data.is_show_cat == 0}
                    checked={data.is_show_sub_cat == 1}
                    onChange={(checked) =>
                        setData("is_show_sub_cat", checked ? 1 : 0)
                    }
                />
            </div>
        </div>
    );
}

export default SettingTab;
