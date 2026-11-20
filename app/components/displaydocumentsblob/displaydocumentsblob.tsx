"use client";

import React, { useEffect, useRef, useState } from "react";
import { FileText, Loader2, RefreshCw, Trash2, Upload, X } from "lucide-react";
import { parseJsonResponse, uploadToBlob } from "@/lib/upload-client";

interface BlobFile {
    filename: string;
    url: string;
    uploadedAt: string;
    size: number;
    pathname: string;
}

interface DocumentsListBlobProps {
    folder: string;
}

interface UploadProgress {
    filename: string;
    status: "pending" | "uploading" | "success" | "error";
    error?: string;
}

const DocumentsListBlob = ({ folder }: DocumentsListBlobProps) => {
    const [files, setFiles] = useState<BlobFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
    };

    const fetchFiles = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/blob/list?folder=${encodeURIComponent(folder)}`);
            const data = await response.json();
            setFiles(data.files || []);
        } catch (error) {
            console.error("Error fetching files:", error);
            setFiles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [folder]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (!fileList) return;
        const filesArray = Array.from(fileList);
        setSelectedFiles(filesArray);
        setUploadProgress(filesArray.map((f) => ({ filename: f.name, status: "pending" })));
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedFiles.length === 0) {
            alert("Selectează cel puțin un fișier");
            return;
        }

        setUploading(true);
        let successCount = 0;
        let errorCount = 0;

        try {
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                setUploadProgress((prev) =>
                    prev.map((p, idx) => (idx === i ? { ...p, status: "uploading" } : p))
                );

                try {
                    await uploadToBlob(file, file.name, folder);
                    setUploadProgress((prev) =>
                        prev.map((p, idx) => (idx === i ? { ...p, status: "success" } : p))
                    );
                    successCount++;
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : "Upload failed";
                    setUploadProgress((prev) =>
                        prev.map((p, idx) =>
                            idx === i ? { ...p, status: "error", error: errorMessage } : p
                        )
                    );
                    errorCount++;
                }
            }

            if (successCount === selectedFiles.length) {
                alert(`${successCount} fișiere încărcate.`);
            } else if (successCount > 0) {
                alert(`${successCount} ok, ${errorCount} eșuate.`);
            } else {
                alert("Toate încărcările au eșuat.");
            }

            await fetchFiles();
            setTimeout(() => {
                setSelectedFiles([]);
                setUploadProgress([]);
                if (inputRef.current) inputRef.current.value = "";
            }, 800);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (file: BlobFile) => {
        if (!confirm(`Ștergi ${file.filename}?`)) return;

        try {
            const response = await fetch(
                `/api/blob/delete?pathname=${encodeURIComponent(file.pathname)}`,
                { method: "DELETE" }
            );
            if (!response.ok) {
                const errorData = await parseJsonResponse<{ error?: string }>(response);
                throw new Error(errorData.error || "Delete failed");
            }
            await fetchFiles();
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to delete file");
        }
    };

    return (
        <div className="space-y-5">
            <form
                onSubmit={handleUpload}
                className="rounded-xl border border-indigo-900/10 bg-indigo-50/40 p-4"
            >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <input
                        ref={inputRef}
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        disabled={uploading}
                        className="flex-1 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-900 file:px-3 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-indigo-950"
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={uploading || selectedFiles.length === 0}
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-900 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-950 disabled:opacity-50"
                        >
                            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                            Încarcă{selectedFiles.length > 0 ? ` (${selectedFiles.length})` : ""}
                        </button>
                        <button
                            type="button"
                            onClick={fetchFiles}
                            className="inline-flex items-center gap-2 rounded-xl border border-indigo-900/15 bg-white px-3 py-2 text-sm font-bold text-indigo-900 hover:bg-white/80"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Refresh
                        </button>
                    </div>
                </div>

                {selectedFiles.length > 0 && (
                    <ul className="mt-3 space-y-2">
                        {selectedFiles.map((file, index) => (
                            <li
                                key={`${file.name}-${index}`}
                                className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm"
                            >
                                <span className="truncate font-medium">
                                    {file.name}
                                    <span className="ml-2 text-gray-500 font-normal">
                                        ({formatFileSize(file.size)})
                                    </span>
                                </span>
                                <div className="flex items-center gap-2">
                                    {uploadProgress[index]?.status === "uploading" && (
                                        <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                                    )}
                                    {uploadProgress[index]?.status === "success" && (
                                        <span className="text-emerald-600 font-bold">✓</span>
                                    )}
                                    {uploadProgress[index]?.status === "error" && (
                                        <span className="text-red-600 text-xs" title={uploadProgress[index].error}>
                                            Eroare
                                        </span>
                                    )}
                                    {!uploading && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
                                                setUploadProgress((prev) => prev.filter((_, i) => i !== index));
                                            }}
                                            className="rounded p-1 hover:bg-red-50"
                                        >
                                            <X className="h-4 w-4 text-red-600" />
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </form>

            <div className="overflow-hidden rounded-xl border border-indigo-900/10">
                <div className="grid grid-cols-[1fr_100px_88px] gap-3 border-b border-indigo-900/10 bg-indigo-50/50 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-indigo-900/60">
                    <span>Fișier</span>
                    <span className="text-right">Mărime</span>
                    <span className="text-right">Acțiuni</span>
                </div>

                {loading ? (
                    <div className="flex items-center gap-2 px-4 py-8 text-sm text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Se încarcă...
                    </div>
                ) : files.length === 0 ? (
                    <div className="px-4 py-10 text-center text-sm text-gray-500">
                        Niciun document încă.
                    </div>
                ) : (
                    <ul className="divide-y divide-indigo-900/10 max-h-[520px] overflow-y-auto">
                        {files.map((file) => (
                            <li
                                key={file.pathname}
                                className="grid grid-cols-[1fr_100px_88px] items-center gap-3 px-4 py-3 hover:bg-indigo-50/40"
                            >
                                <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex min-w-0 items-center gap-2 text-sm font-bold text-indigo-950 hover:text-indigo-900"
                                >
                                    <FileText className="h-4 w-4 shrink-0 text-indigo-900" />
                                    <span className="truncate">{file.filename}</span>
                                </a>
                                <span className="text-right text-xs text-gray-500">
                                    {formatFileSize(file.size)}
                                </span>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(file)}
                                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                                        title="Șterge"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default DocumentsListBlob;
