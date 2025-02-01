import { toast } from "react-toastify";

export const handleCopy = (message: string, toastMessage: string) => {
    navigator.clipboard.writeText(message);
    toast.success(toastMessage);
};