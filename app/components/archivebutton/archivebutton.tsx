
import React from "react";
import {Button} from "@/components/ui/button";
import {promises as fs} from "fs";
import path from "path";

const archiveButton = ({firstFolder, fileName}: { firstFolder: string; fileName: string }) => {


    async function functie2(oldPath, newPath){
        "use server";
        var fs = require('fs')
        fs.rename(oldPath, newPath, function (err) {
            if (err) throw err
            console.log('Successfully renamed - AKA moved!')
        })
    }
    async function functie(){
        "use server";


        var oldPath=firstFolder+'/'+fileName;
        var newPath='public/uploads/archive/' +fileName;
        console.log(oldPath)
        console.log(newPath)
        functie2(oldPath,newPath);



    }

    return (
        <div>
            <div className="relative inline-flex group">
                <div className=" group-hover:opacity-100 group-hover:block opacity-0 hidden transition-opacity mr-1">
                    <div>
                        <Button formAction={functie}  className="text-xl rounded-md shadow-xl bg-white text-black border-2 border-solid hover:bg-gray-200 font-bold">Confirm</Button>
                    </div>
                </div>
                <div>
                    <Button className="text-xl rounded-md shadow-xl bg-white text-black border-2 border-solid hover:bg-gray-200 font-bold">Archive</Button>
                </div>

            </div>



        </div>
    );
};

export default archiveButton;
