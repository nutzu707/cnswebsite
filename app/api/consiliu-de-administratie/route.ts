import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const directoryPath = path.join(process.cwd(), "public", "uploads", "consiliu-de-administratie");
        const files = await fs.promises.readdir(directoryPath);

        const people = await Promise.all(
            files
                .filter((file) => file.endsWith(".json"))
                .map(async (file) => {
                    const filePath = path.join(directoryPath, file);
                    const fileContent = await fs.promises.readFile(filePath, "utf-8");
                    const parsedData = JSON.parse(fileContent);
                    return {
                        filename: file,
                        person: parsedData.person,
                    };
                })
        );

        return NextResponse.json({ people });
    } catch (error) {
        console.error("Error reading consiliu-de-administratie files:", error);
        return NextResponse.json({ people: [], error: "Failed to read consiliu-de-administratie" }, { status: 500 });
    }
}

