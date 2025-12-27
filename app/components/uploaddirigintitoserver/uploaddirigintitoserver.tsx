"use server";

import { promises as fs } from "fs";

export default async function uploadDirigintiToServer(name: string, filedata: File) {
    const data = await filedata.arrayBuffer();
    await fs.writeFile(`${process.cwd()}/public/uploads/documents/${name}`, Buffer.from(data));
}
