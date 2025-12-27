// app/components/documents-list.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Archivebutton from "@/app/components/archivebutton/archivebutton";

interface DocumentsListProps {
    folderPath: string;
}

const DocumentsListDash = ({ folderPath }: DocumentsListProps) => {
    const [documentFiles, setDocumentFiles] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/documents?folder=${encodeURIComponent(folderPath)}`);
            const data = await response.json();
            setDocumentFiles(data.files || []);
        } catch (error) {
            console.error('Error fetching documents:', error);
            setDocumentFiles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [folderPath]);

    // Expose refresh function to parent via window event
    useEffect(() => {
        const handleRefresh = (e: CustomEvent) => {
            if (e.detail === folderPath) {
                fetchDocuments();
            }
        };
        window.addEventListener('refreshDocuments' as any, handleRefresh as any);
        return () => window.removeEventListener('refreshDocuments' as any, handleRefresh as any);
    }, [folderPath]);

    // Generate document path - use direct static URL
    const getDocumentPath = (document: string) => {
        // Convert folderPath like "public/uploads/documents/documente-management" 
        // to "/uploads/documents/documente-management"
        const relativePath = folderPath.replace(/^public\//, '/');
        return `${relativePath}/${document}`;
    };

    if (loading) {
        return (
            <div>
                <ul>
                    <li className="text-xl">Loading...</li>
                </ul>
            </div>
        );
    }

    return (
        <div>
            <ul>
                {documentFiles.length === 0 ? (
                    <li>No documents available</li>
                ) : (
                    documentFiles.map((document, index) => {
                        const documentPath = getDocumentPath(document);

                        return (
                            <li key={index} className="flex w-full border-t-2 text-2xl">
                                <div className="w-[500px] break-all content-center">
                                    <Link href={documentPath} target="_blank">{document}</Link>
                                </div>

                                <div className="mr-0 ml-auto content-center py-2">
                                    <Archivebutton 
                                        firstFolder={folderPath} 
                                        fileName={document}
                                        onArchiveComplete={() => fetchDocuments()}
                                    />
                                </div>
                            </li>
                        );
                    })
                )}
            </ul>
        </div>
    );
};

export default DocumentsListDash;
