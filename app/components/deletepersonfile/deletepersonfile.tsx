"use server";

import { promises as fs } from "fs";
import path from "path";

const deletePersonFile = async (folder: string, filename: string) => {
    "use server";
    try {
        const filePath = path.join(process.cwd(), "public", "uploads", folder, filename);
        await fs.unlink(filePath);
    } catch (error) {
        console.error("Failed to delete file", filename, "in", folder, error);
        throw error;
    }
};

export default deletePersonFile;

