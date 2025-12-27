"use server";

import { promises as fs } from "fs";

export default async function uploadConducerePersonToServer(name: string, filedata: File) {
    const data = await filedata.arrayBuffer();
    await fs.writeFile(`${process.cwd()}/public/uploads/conducere/${name}`, Buffer.from(data));
}
