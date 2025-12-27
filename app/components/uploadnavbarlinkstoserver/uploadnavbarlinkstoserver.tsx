"use server";

import { promises as fs } from "fs";

export default async function uploadNavbarLinksToServer(name: string, filedata: File) {
    const data = await filedata.arrayBuffer();
    await fs.writeFile(`${process.cwd()}/public/uploads/documents/websitedocs/${name}`, Buffer.from(data));
}
