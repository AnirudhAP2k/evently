import axios from "axios";
import React, { useState, useCallback } from "react";
import { Button } from "../ui/button";
import { CloudUpload, X } from "lucide-react";

interface FileUploaderProps {
    imageUrl: string;
    onFieldChange: (value: File | null) => void;
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const FileUploader = ({ onFieldChange, imageUrl, setFiles } : FileUploaderProps) => {
    const [files, setLocalFiles] = useState<File[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(imageUrl || null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
        setLocalFiles(acceptedFiles);
    }, [setFiles]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
    
            setPreview(URL.createObjectURL(selectedFile)); // Show preview
            setFile(selectedFile);
            setFiles([selectedFile]);
    
            onFieldChange(selectedFile);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            const selectedFile = droppedFiles[0];
    
            setPreview(URL.createObjectURL(selectedFile));
            setFile(selectedFile);
            setFiles([selectedFile]);
    
            onFieldChange(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            alert("No files selected");
            return;
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

            alert("Upload successful: " + response.data.name);
        } catch (error: any) {
            console.error("Upload failed:", error.response?.data?.error || error.message);
            alert("Upload failed");
        }
    };

    const handleRemove = () => {
        setPreview(null);
        setFile(null);
        setFiles([]);
        onFieldChange(null);
    };

    return (
        <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer transition-all hover:border-blue-500"
        >
            {preview ? (
                <div className="relative w-full">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-52 object-contain rounded-lg shadow-md"
                    />
                    <button
                        onClick={handleRemove}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
                        title="Remove Image"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <label htmlFor="fileInput" className="flex flex-col items-center cursor-pointer">
                    <CloudUpload size={50} className="text-gray-500 mb-2 transition-all hover:text-blue-500" />
                    <p className="text-gray-600">
                        Drag & drop files here or{" "}
                        <span className="text-blue-500 underline">browse</span>
                    </p>
                </label>
            )}
            <input
                id="fileInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
};

export default FileUploader;
