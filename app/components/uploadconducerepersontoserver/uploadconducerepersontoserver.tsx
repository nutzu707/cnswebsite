"use server";

import React from "react";
import {promises as fs} from "fs";

const uploadConducerePersonToServer = (name , filedata) => {


    async function functie(name, filedata){
        "use server";
        console.log(name)
        console.log(filedata)


        const data = await filedata.arrayBuffer();
        await fs.writeFile(`${process.cwd()}/public/uploads/conducere/${name}`, Buffer.from(data));

    }
    functie(name, filedata);




    return (
        <div></div>
    );
};

export default uploadConducerePersonToServer;
