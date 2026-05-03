import { useToast } from "vue-toastification";

const toast = useToast();

export const toastfy = {
    success(message) {
        toast.success(message);
    },
    error(message) {
        toast.error(message);
    },
    warning(message) {
        toast.warning(message);
    },
    info(message) {
        toast.info(message);
    }
};
