import { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { message } from "antd";

export default function FlashMessage() {
    const { flash } = usePage().props;
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
        if (flash.success) {
            messageApi.success(flash.success);
            setTimeout(() => (flash.success = null), 100);
        }
        if (flash.error) {
            messageApi.error(flash.error);
            setTimeout(() => (flash.error = null), 100);
        }
    }, [flash.success, flash.error]);

    return <>{contextHolder}</>;
}
