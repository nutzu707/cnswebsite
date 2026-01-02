/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { SquareArrowRight } from 'lucide-react';

interface BlobFile {
    filename: string;
    url: string;
    uploadedAt: string;
    size: number;
    pathname: string;
}

interface DocumentsListBlobPublicProps {
    folder: string;
}

const DocumentsListBlobPublic = ({ folder }: DocumentsListBlobPublicProps) => {
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

        fetchFiles();
    }, [folder]);

    if (loading) {
        return (
            <div>
                <ul>
                    <li className="text-xl">Loading documents...</li>
                </ul>
            </div>
        );
    }

    return (
        <div>
            <ul>
                {files.length === 0 ? (
                    <li></li>
                ) : (
                    files.map((file, index) => {
                        const delay = `${index * 40}ms`;

                        return (
                            <a
                                key={file.pathname}
                                className="animate-fadeIn opacity-0"
                                style={{ animationDelay: delay }}
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <hr className="solid border-t-2" />
                                <div className="flex mt-1 lg:mb-1">
                                    <img className="lg:w-8 w-6 lg:h-8 h-6 mr-2" src="/websiteUI/document-icon.png" alt="icon" />
                                    <div className="lg:text-2xl text-xl font-bold break-all flex-1">
                                        {file.filename}
                                    </div>
                                    <div className="text-gray-600 lg:text-lg text-sm self-center mx-4 whitespace-nowrap">
                                        {formatFileSize(file.size)}
                                    </div>
                                    <SquareArrowRight className="ml-auto self-center min-w-6 text-indigo-900" />
                                </div>
                            </a>
                        );
                    })
                )}

                <div
                    className="animate-fadeIn opacity-0"
                    style={{ animationDelay: `${files.length * 40}ms` }}
                >
                    <hr className="solid border-t-2" />
                </div>
            </ul>
        </div>
    );
};

export default DocumentsListBlobPublic;

