import moment from "moment";

export function formatDate(dateString, format = "DD/MM/YYYY") {
    if (!dateString) return "-";
    return moment(dateString).format(format);
}

export const userRole = () => ["admin", "operator"];

export const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
};
