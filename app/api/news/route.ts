import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const newsDirectory = path.join(process.cwd(), "public", "uploads", "news");
        const fileNames = await fs.promises.readdir(newsDirectory);

        const newsItems = await Promise.all(
            fileNames
                .filter((fileName) => fileName.endsWith(".json"))
                .map(async (fileName) => {
                    const filePath = path.join(newsDirectory, fileName);
                    const fileContent = await fs.promises.readFile(filePath, "utf-8");
                    const jsonData = JSON.parse(fileContent);

                    const { title, post_date, thumbnail } = jsonData.article;

                    return {
                        title,
                        date: post_date,
                        image: thumbnail,
                        link: `/anunt?id=${fileName.replace(".json", "")}`,
                    };
                })
        );

        return NextResponse.json({ newsItems });
    } catch (error) {
        console.error("Error reading news files:", error);
        return NextResponse.json({ newsItems: [], error: "Failed to read news" }, { status: 500 });
    }
}

