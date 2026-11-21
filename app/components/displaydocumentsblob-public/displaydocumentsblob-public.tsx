/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { FileText, ExternalLink, Loader2 } from 'lucide-react';

interface BlobFile {
    filename: string;
    url: string;
    uploadedAt: string;
    size: number;
    pathname: string;
}

interface DocumentsListBlobPublicProps {
    folder: string;
    /** Extra docs shown with the folder list (e.g. previous-year files still hosted elsewhere). */
    extraFiles?: BlobFile[];
}

/** Stable default — inline `[]` would retrigger the fetch effect every render. */
const EMPTY_EXTRA_FILES: BlobFile[] = [];

const DocumentsListBlobPublic = ({
    folder,
    extraFiles = EMPTY_EXTRA_FILES,
}: DocumentsListBlobPublicProps) => {
    const [files, setFiles] = useState<BlobFile[]>([]);
    const [loading, setLoading] = useState(true);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    useEffect(() => {
        let cancelled = false;

        const fetchFiles = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/blob/list?folder=${encodeURIComponent(folder)}`);
                const data = await response.json();
                if (cancelled) return;
                const fromFolder: BlobFile[] = data.files || [];
                const folderPathnames = new Set(fromFolder.map((f) => f.pathname));
                const extras = extraFiles.filter((f) => !folderPathnames.has(f.pathname));
                setFiles([...fromFolder, ...extras]);
            } catch (error) {
                console.error('Error fetching files:', error);
                if (!cancelled) setFiles(extraFiles);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchFiles();
        return () => {
            cancelled = true;
        };
    }, [folder, extraFiles]);

    if (loading) {
        return (
            <div className="flex items-center gap-3 py-6">
                <Loader2 className="w-6 h-6 text-indigo-900 animate-spin" />
                <span className="text-lg text-gray-600">Se încarcă documentele...</span>
            </div>
        );
    }

    return (
        <div>
            {files.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg">Nu sunt documente disponibile momentan</p>
                </div>
            ) : (
                <ul className="space-y-2">
                    {files.map((file, index) => {
                        const delay = `${index * 40}ms`;

                        return (
                            <li
                                key={file.pathname}
                                className="animate-fadeIn opacity-0"
                                style={{ animationDelay: delay }}
                            >
                                <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 bg-brand-paper hover:border-indigo-900 hover:shadow-md transition-all duration-300"
                                >
                                    <div className="bg-indigo-50 p-2 rounded-lg group-hover:bg-indigo-900 transition-colors duration-300">
                                        <FileText className="w-6 h-6 text-indigo-900 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="break-words text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-indigo-900 lg:text-xl">
                                            {file.filename}
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {formatFileSize(file.size)}
                                        </div>
                                    </div>
                                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-indigo-900 flex-shrink-0 transition-all duration-300 group-hover:scale-110" />
                                </a>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default DocumentsListBlobPublic;

