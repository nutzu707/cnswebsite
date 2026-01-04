"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { upload } from '@vercel/blob/client';

interface BlobFile {
    filename: string;
    url: string;
    uploadedAt: string;
    size: number;
    pathname: string;
}

interface StorageUsage {
    totalSize: number;
    usedSize: number;
    availableSize: number;
}

interface DocumentsListBlobProps {
    folder: string;
}

const DocumentsListBlob = ({ folder }: DocumentsListBlobProps) => {
    const [files, setFiles] = useState<BlobFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [storageUsage, setStorageUsage] = useState<StorageUsage | null>(null);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const fetchStorageUsage = async () => {
        try {
            const response = await fetch('/api/blob/usage');
            const data = await response.json();
            setStorageUsage(data);
        } catch (error) {
            console.error('Error fetching storage usage:', error);
        }
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
        fetchStorageUsage();
    }, [folder]);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedFile) {
            alert('Please select a file');
            return;
        }

        // Check if file already exists
        const existingFile = files.find(f => f.filename === selectedFile.name);
        if (existingFile) {
            alert(`File "${selectedFile.name}" already exists. Please delete the old file first or use a different name.`);
            return;
        }

        // Check if enough storage space
        if (storageUsage && selectedFile.size > storageUsage.availableSize) {
            alert(`Not enough storage space. File size: ${formatFileSize(selectedFile.size)}, Available: ${formatFileSize(storageUsage.availableSize)}`);
            return;
        }

        setUploading(true);
        try {
            // Client-side upload directly to Vercel Blob (bypasses 4.5 MB limit!)
            const blob = await upload(`${folder}/${selectedFile.name}`, selectedFile, {
                access: 'public',
                handleUploadUrl: '/api/blob/upload-token',
            });

            console.log('Upload successful:', blob.url);
            setSelectedFile(null);
            // Reset file input
            const fileInput = document.querySelector(`input[type="file"][data-folder="${folder}"]`) as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            // Refresh the list and storage usage
            await fetchFiles();
            await fetchStorageUsage();
            alert('File uploaded successfully!');
        } catch (error: any) {
            console.error('Error uploading file:', error);
            const errorMessage = error?.message || 'Failed to upload file';
            alert(errorMessage);
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
                await fetchStorageUsage();
            } else {
                throw new Error('Delete failed');
            }
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('Failed to delete file');
        }
    };

    const hasEnoughSpace = !selectedFile || !storageUsage || selectedFile.size <= storageUsage.availableSize;
    const fileAlreadyExists = selectedFile && files.some(f => f.filename === selectedFile.name);

    return (
        <div>
            {/* Upload Form */}
            <form onSubmit={handleUpload} className="mb-4">
                <div className="flex flex-col lg:flex-row w-full">
                    <div className="flex-1">
                        <input
                            className="file:bg-white bg-none file:cursor-pointer file:border-gray-300 file:clear-start file:border-2 file:rounded-md file:hover:bg-gray-200 file:shadow-xl file:text-xl"
                            type="file"
                            data-folder={folder}
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            disabled={uploading}
                        />
                        {selectedFile && (
                            <div className="mt-2 text-sm">
                                <span className="font-semibold">File size: </span>
                                <span className={!hasEnoughSpace ? 'text-red-600 font-bold' : ''}>
                                    {formatFileSize(selectedFile.size)}
                                </span>
                                {!hasEnoughSpace && storageUsage && (
                                    <span className="text-red-600 ml-2">
                                        (Available: {formatFileSize(storageUsage.availableSize)})
                                    </span>
                                )}
                                {fileAlreadyExists && (
                                    <span className="text-orange-600 ml-2 font-semibold">
                                        ⚠ File already exists
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="mr-0 flex ml-auto mt-1 lg:mt-0">
                        <Button
                            type="submit"
                            disabled={uploading || !selectedFile || !hasEnoughSpace || fileAlreadyExists}
                            className={`text-xl rounded-md shadow-xl bg-white text-black border-2 border-solid hover:bg-gray-200 font-bold mb-8 mr-2 ${(!hasEnoughSpace || fileAlreadyExists) && selectedFile ? 'opacity-50 blur-[1px] cursor-not-allowed' : ''}`}
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
                                fetchFiles();
                                fetchStorageUsage();
                            }}
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

