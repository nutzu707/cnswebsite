"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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

const DocumentsListBlob = ({ folder }: DocumentsListBlobProps) => {
    const [files, setFiles] = useState<BlobFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const fetchFiles = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/blob/list?folder=${encodeURIComponent(folder)}`);
            const data = await response.json();
            setFiles(data.files || []);
        } catch (error) {
            console.error('Error fetching files:', error);
            setFiles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [folder]);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedFile) {
            alert('Please select a file');
            return;
        }

        setUploading(true);
        try {
            const response = await fetch(
                `/api/blob/upload?filename=${encodeURIComponent(selectedFile.name)}&folder=${encodeURIComponent(folder)}`,
                {
                    method: 'POST',
                    body: selectedFile,
                }
            );

            if (response.ok) {
                const result = await response.json();
                console.log('Upload successful:', result);
                setSelectedFile(null);
                // Reset file input
                const fileInput = document.querySelector(`input[type="file"][data-folder="${folder}"]`) as HTMLInputElement;
                if (fileInput) fileInput.value = '';
                // Refresh the list
                await fetchFiles();
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (file: BlobFile) => {
        if (!confirm(`Are you sure you want to delete ${file.filename}?`)) {
            return;
        }

        try {
            const response = await fetch(
                `/api/blob/delete?url=${encodeURIComponent(file.url)}`,
                { method: 'DELETE' }
            );

            if (response.ok) {
                console.log('Delete successful');
                await fetchFiles();
            } else {
                throw new Error('Delete failed');
            }
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('Failed to delete file');
        }
    };

    return (
        <div>
            {/* Upload Form */}
            <form onSubmit={handleUpload} className="mb-4">
                <div className="flex flex-col lg:flex-row w-full">
                    <input
                        className="file:bg-white bg-none file:cursor-pointer file:border-gray-300 file:clear-start file:border-2 file:rounded-md file:hover:bg-gray-200 file:shadow-xl file:text-xl"
                        type="file"
                        data-folder={folder}
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        disabled={uploading}
                    />
                    <div className="mr-0 flex ml-auto mt-1 lg:mt-0">
                        <Button
                            type="submit"
                            disabled={uploading || !selectedFile}
                            className="text-xl rounded-md shadow-xl bg-white text-black border-2 border-solid hover:bg-gray-200 font-bold mb-8 mr-2"
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </Button>
                        <Button
                            type="button"
                            onClick={fetchFiles}
                            className="text-xl rounded-md shadow-xl bg-white text-black border-2 border-solid hover:bg-gray-200 font-bold mb-8"
                        >
                            Refresh
                        </Button>
                    </div>
                </div>
            </form>

            {/* File List */}
            <div className="h-[300px] overflow-y-scroll pr-5">
                {loading ? (
                    <div className="text-xl">Loading...</div>
                ) : files.length === 0 ? (
                    <div className="text-xl">No documents available</div>
                ) : (
                    <ul>
                        {files.map((file, index) => (
                            <li key={file.pathname} className="flex w-full border-t-2 text-2xl">
                                <div className="flex-1 break-all content-center">
                                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                                        {file.filename}
                                    </a>
                                </div>
                                <div className="content-center px-4 text-gray-600 text-lg whitespace-nowrap">
                                    {formatFileSize(file.size)}
                                </div>
                                <div className="mr-0 content-center py-2">
                                    <Button
                                        onClick={() => handleDelete(file)}
                                        className="text-xl rounded-md shadow-xl bg-white text-black border-2 border-solid hover:bg-red-200 font-bold"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                <hr className="solid border-t-2" />
            </div>
        </div>
    );
};

export default DocumentsListBlob;

