import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const folderPath = searchParams.get("folder");

        if (!folderPath) {
            return NextResponse.json({ files: [], error: "No folder specified" }, { status: 400 });
        }

        // Security: prevent directory traversal
        if (folderPath.includes("..")) {
            return NextResponse.json({ files: [], error: "Invalid folder path" }, { status: 400 });
        }

        const fullPath = path.join(process.cwd(), folderPath);

        // Check if directory exists
        if (!fs.existsSync(fullPath)) {
            return NextResponse.json({ files: [] });
        }

        const files = await fs.promises.readdir(fullPath);

        return NextResponse.json({ files });
    } catch (error) {
        console.error("Error reading documents:", error);
        return NextResponse.json({ files: [], error: "Failed to read documents" }, { status: 500 });
    }
}

