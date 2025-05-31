import axios from "axios";

export const handleUpload = async (files: File[] ) => {
    if (files.length === 0) {
        return null;
    }

    const formData = new FormData();
    files.forEach((file) => {
        formData.append("file", file);
    });

    try {
        const response = await axios.post("/api/file-upload", formData, {
            headers: {
            "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error: any) {
        console.error("Upload failed:", error.response?.data?.error || error.message);
        return null;
    }
};