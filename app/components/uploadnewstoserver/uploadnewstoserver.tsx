"use server";

import {promises as fs} from "fs";

const uploadNewsToServer = async (name: string, filedata: File) => {
    console.log(name)
    console.log(filedata)

    const data = await filedata.arrayBuffer();
    await fs.writeFile(`${process.cwd()}/public/uploads/news/${name}`, Buffer.from(data));
};

export default uploadNewsToServer;
