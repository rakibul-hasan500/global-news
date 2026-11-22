import toast from "react-hot-toast";

type ResponseType = "S" | "E" | "W" | "I" | "L";

export const responseHandler = (type: ResponseType, message: string) => {
    switch (type) {
        case "S":
            return toast.success(message);

        case "E":
            return toast.error(message);

        case "W":
            return toast(message);

        case "I":
            return toast(message);

        case "L":
            return toast.loading(message);
    }
};