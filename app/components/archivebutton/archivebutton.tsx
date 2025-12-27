"use client";

import React, { useState } from "react";
import {Button} from "@/components/ui/button";
import { archiveFile } from "@/app/actions/archive-file";

const archiveButton = ({firstFolder, fileName, onArchiveComplete}: { 
    firstFolder: string; 
    fileName: string;
    onArchiveComplete?: () => void;
}) => {
    const [isArchiving, setIsArchiving] = useState(false);

    const handleArchive = async () => {
        setIsArchiving(true);
        try {
            const result = await archiveFile(firstFolder, fileName);
            if (result.success) {
                console.log('File archived successfully');
                if (onArchiveComplete) {
                    onArchiveComplete();
                }
            } else {
                console.error('Archive failed:', result.error);
                alert('Failed to archive file: ' + result.error);
            }
        } catch (error) {
            console.error('Error archiving:', error);
            alert('Error archiving file');
        } finally {
            setIsArchiving(false);
        }
    };

    return (
        <div className="relative inline-flex group">
            <div className=" group-hover:opacity-100 group-hover:block opacity-0 hidden transition-opacity mr-1">
                <div>
                    <Button 
                        onClick={handleArchive}
                        disabled={isArchiving}
                        className="text-xl rounded-md shadow-xl bg-white text-black border-2 border-solid hover:bg-gray-200 font-bold"
                    >
                        {isArchiving ? 'Archiving...' : 'Confirm'}
                    </Button>
                </div>
            </div>
            <div>
                <Button 
                    type="button" 
                    className="text-xl rounded-md shadow-xl bg-white text-black border-2 border-solid hover:bg-gray-200 font-bold"
                >
                    Archive
                </Button>
            </div>
        </div>
    );
};

export default archiveButton;

