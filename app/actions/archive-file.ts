"use server";

import fs from "fs";
import path from "path";

export async function archiveFile(folderPath: string, fileName: string) {
    try {
        const oldPath = path.join(folderPath, fileName);
        const newPath = path.join('public/uploads/archive', fileName);
        
        console.log('Archiving file from:', oldPath);
        console.log('To:', newPath);
        
        // Ensure archive directory exists
        const archiveDir = path.join(process.cwd(), 'public/uploads/archive');
        if (!fs.existsSync(archiveDir)) {
            await fs.promises.mkdir(archiveDir, { recursive: true });
        }
        
        // Move the file
        await fs.promises.rename(
            path.join(process.cwd(), oldPath),
            path.join(process.cwd(), newPath)
        );
        
        console.log('File archived successfully');
        return { success: true };
    } catch (error) {
        console.error('Error archiving file:', error);
        return { success: false, error: String(error) };
    }
}

