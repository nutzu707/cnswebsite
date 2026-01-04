"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";

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

interface UploadProgress {
    filename: string;
    status: 'pending' | 'uploading' | 'success' | 'error';
    error?: string;
}

const DocumentsListBlob = ({ folder }: DocumentsListBlobProps) => {
    const [files, setFiles] = useState<BlobFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);

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

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (fileList) {
            const filesArray = Array.from(fileList);
            setSelectedFiles(filesArray);
            setUploadProgress(filesArray.map(f => ({
                filename: f.name,
                status: 'pending'
            })));
        }
    };

    const removeSelectedFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setUploadProgress(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (selectedFiles.length === 0) {
            alert('Please select at least one file');
            return;
        }

        setUploading(true);
        let successCount = 0;
        let errorCount = 0;
        
        try {
            // Upload files sequentially to avoid overwhelming the server
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                
                // Update status to uploading
                setUploadProgress(prev => prev.map((p, idx) => 
                    idx === i ? { ...p, status: 'uploading' } : p
                ));

                try {
                    const response = await fetch(
                        `/api/blob/upload?filename=${encodeURIComponent(file.name)}&folder=${encodeURIComponent(folder)}`,
                        {
                            method: 'POST',
                            body: file,
                        }
                    );

                    if (response.ok) {
                        setUploadProgress(prev => prev.map((p, idx) => 
                            idx === i ? { ...p, status: 'success' } : p
                        ));
                        successCount++;
                    } else {
                        const errorData = await response.json();
                        const errorMessage = errorData.error || `Upload failed with status ${response.status}`;
                        setUploadProgress(prev => prev.map((p, idx) => 
                            idx === i ? { ...p, status: 'error', error: errorMessage } : p
                        ));
                        errorCount++;
                    }
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
                    setUploadProgress(prev => prev.map((p, idx) => 
                        idx === i ? { ...p, status: 'error', error: errorMessage } : p
                    ));
                    errorCount++;
                }
            }

            // Show result message
            if (successCount === selectedFiles.length) {
                alert(`All ${successCount} files uploaded successfully!`);
            } else if (successCount > 0) {
                alert(`${successCount} files uploaded successfully, ${errorCount} failed.`);
            } else {
                alert('All uploads failed. Please check the errors and try again.');
            }

            // Refresh the list
            await fetchFiles();
            
            // Reset after a delay to show success status
            setTimeout(() => {
                setSelectedFiles([]);
                setUploadProgress([]);
                const fileInput = document.querySelector(`input[type="file"][data-folder="${folder}"]`) as HTMLInputElement;
                if (fileInput) fileInput.value = '';
            }, 2000);

        } catch (error) {
            console.error('Error uploading files:', error);
            alert('An unexpected error occurred');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (file: BlobFile) => {
        if (!confirm(`Are you sure you want to delete ${file.filename}?`)) {
            return;
        }

        try {
            console.log('Deleting file:', file.pathname);
            const response = await fetch(
                `/api/blob/delete?pathname=${encodeURIComponent(file.pathname)}`,
                { method: 'DELETE' }
            );

            if (response.ok) {
                console.log('Delete successful');
                await fetchFiles();
                alert('File deleted successfully!');
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.error || 'Delete failed';
                console.error('Delete failed:', errorMessage);
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error deleting file:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete file';
            alert(`Failed to delete file: ${errorMessage}`);
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
                        multiple
                        onChange={handleFileSelect}
                        disabled={uploading}
                    />
                    <div className="mr-0 flex ml-auto mt-1 lg:mt-0">
                        <Button
                            type="submit"
                            disabled={uploading || selectedFiles.length === 0}
                            className="text-xl rounded-md shadow-xl bg-white text-black border-2 border-solid hover:bg-gray-200 font-bold mb-8 mr-2"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin inline" />
                                    Uploading...
                                </>
                            ) : (
                                `Upload ${selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}`
                            )}
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

                {/* Selected Files Preview */}
                {selectedFiles.length > 0 && (
                    <div className="mb-4 p-4 border-2 rounded-lg bg-gray-50">
                        <h4 className="font-bold text-lg mb-2">Selected Files ({selectedFiles.length}):</h4>
                        <ul className="space-y-2">
                            {selectedFiles.map((file, index) => (
                                <li key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                                    <div className="flex-1">
                                        <span className="font-medium">{file.name}</span>
                                        <span className="text-gray-500 text-sm ml-2">({formatFileSize(file.size)})</span>
                                    </div>
                                    {uploadProgress[index] && (
                                        <div className="flex items-center gap-2">
                                            {uploadProgress[index].status === 'pending' && (
                                                <span className="text-gray-500 text-sm">Waiting...</span>
                                            )}
                                            {uploadProgress[index].status === 'uploading' && (
                                                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                                            )}
                                            {uploadProgress[index].status === 'success' && (
                                                <span className="text-green-600 font-bold">✓</span>
                                            )}
                                            {uploadProgress[index].status === 'error' && (
                                                <span className="text-red-600 text-sm" title={uploadProgress[index].error}>
                                                    ✗ Error
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    {!uploading && (
                                        <button
                                            type="button"
                                            onClick={() => removeSelectedFile(index)}
                                            className="ml-2 p-1 hover:bg-red-100 rounded"
                                        >
                                            <X className="w-4 h-4 text-red-600" />
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
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

