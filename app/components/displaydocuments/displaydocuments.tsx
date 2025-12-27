// app/components/documents-list.tsx

/* eslint-disable @next/next/no-img-element */
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import React from "react";
import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import { SquareArrowDownLeft, SquareArrowOutUpRight, SquareArrowOutUpRightIcon, SquareArrowRight } from 'lucide-react';

interface DocumentsListProps {
    folderPath: string;
}

const DocumentList = async ({ folderPath }: DocumentsListProps) => {
    let documentFiles: string[] = [];

    try {
        if (fs.existsSync(folderPath)) {
            const files = await fs.promises.readdir(folderPath);
            documentFiles = files;
        } else {
            // Folder missing; render empty list without failing build
            documentFiles = [];
        }
    } catch (error) {
        // If reading fails, fall back to empty list to keep the page rendering
        documentFiles = [];
    }

    const totalItems = documentFiles.length ;
    return (
        <div>
            <ul>
                {documentFiles.length === 0 ? (
                    <li></li>
                ) : (
                    documentFiles.map((document, index) => {
                        const documentPath = path.join('assets', 'documents', path.basename(folderPath), document);
                        const delay = `${index * 40}ms`;

                        return (
                            <a
                                key={index}
                                className="animate-fadeIn opacity-0"
                                style={{ animationDelay: delay }}
                                href={`/${documentPath}`}
                                target="_blank"
                            >
                                <hr className="solid border-t-2" />
                                <div className="flex mt-1 lg:mb-1">
                                    <img className="lg:w-8 w-6 lg:h-8 h-6 mr-2" src="/websiteUI/document-icon.png" alt="icon" />
                                    <div className="lg:text-2xl text-xl font-bold break-all"  >
                                        {document}
                                    </div>
                                    <SquareArrowRight className="ml-auto self-center min-w-6 text-indigo-900"/>
                                </div>
                            </a>
                        );
                    })
                )}

                <div
                    className="animate-fadeIn opacity-0"
                    style={{ animationDelay: `${totalItems * 40}ms` }}
                >
                    <hr className="solid border-t-2" />
                </div>
            </ul>
        </div>
    );
};

export default DocumentList;
