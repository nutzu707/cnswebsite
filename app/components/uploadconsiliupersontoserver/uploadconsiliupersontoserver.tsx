"use server";

import { promises as fs } from "fs";

export default async function uploadConsiliuPersonToServer(name: string, filedata: File) {
    const data = await filedata.arrayBuffer();
    await fs.writeFile(`${process.cwd()}/public/uploads/consiliu-de-administratie/${name}`, Buffer.from(data));
}
