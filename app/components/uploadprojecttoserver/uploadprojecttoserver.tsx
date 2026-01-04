"use server";

import {promises as fs} from "fs";

const uploadProjectToServer = async (name: string, filedata: File) => {
        console.log(name)
        console.log(filedata)

        const data = await filedata.arrayBuffer();
        await fs.writeFile(`${process.cwd()}/public/uploads/projects/${name}`, Buffer.from(data));
};

export default uploadProjectToServer;
