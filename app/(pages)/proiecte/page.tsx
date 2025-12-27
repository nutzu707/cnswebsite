
import fs from 'fs';
import path from 'path';
import React from 'react';
import PageTitle from "@/app/components/pagetitle/pagetitle";
import PageBody from "@/app/components/pagebody/pagebody";
import Footer from "@/app/components/footer/footer";

const getContrastingTextColor = (bgColor: string): string => {
    if (bgColor.startsWith("#")) {
        bgColor = bgColor.substring(1);
    }

    const r = parseInt(bgColor.substring(0, 2), 16);
    const g = parseInt(bgColor.substring(2, 4), 16);
    const b = parseInt(bgColor.substring(4, 6), 16);

    const luminance = 0.2126 * (r / 255) ** 2.2 + 0.7152 * (g / 255) ** 2.2 + 0.0722 * (b / 255) ** 2.2;

    return luminance > 0.5 ? "text-black" : "text-white";
};

const ensureProtocol = (url: string): string => {
    if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
    }
    return url;
};

export default async function Proiecte() {

    const projectsDirectory = path.join(process.cwd(), 'public','uploads', 'projects');
    const fileNames = fs.readdirSync(projectsDirectory);

    const projects = await Promise.all(
        fileNames.map(async (fileName) => {
            const filePath = path.join(projectsDirectory, fileName);
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const projectData = JSON.parse(fileContents);
            return projectData;
        })
    );

    return (
        <div>
            <PageBody>
                <PageTitle text="PROIECTE" />
                <div className="mt-16 lg:mt-24 self-center">
                    <div className="space-y-[25px] lg:w-[1000px] w-full">
                        {projects.map((project, index) => {
                            const bgColor = project.project.color; // Background color from JSON
                            const textColor = getContrastingTextColor(bgColor); // Get contrasting text color
                            const link = ensureProtocol(project.project.link); // Ensure the link has the correct protocol

                            return (
                                <a
                                    key={index}
                                    href={link}
                                    target="_self"
                                    rel="noopener noreferrer"
                                    className={`w-full h-[300px] lg:h-[100px]  lg:flex  cursor-pointer ${textColor}`}


                                >

                                        <div className="w-full h-[100px] hover:mb-[20px] items-center hidden lg:flex rounded-2xl shadow-2xl" style={{ backgroundColor: bgColor }}>
                                            <h1 className="lg:text-5xl text-3xl font-bold lg:ml-10 uppercase">
                                                {project.project.title}
                                            </h1>
                                            <img
                                                src={project.project.photo}
                                                alt={project.project.title}
                                                className="lg:h-[95%] h-[100px] lg:ml-auto lg:mr-10"
                                            />
                                        </div>

                                    <div className="w-full h-[200px] justify-center items-center flex flex-col lg:hidden rounded-2xl shadow-2xl mb-4" style={{ backgroundColor: bgColor }}>
                                        <h1 className="lg:text-5xl text-3xl  text-center px-4 font-bold lg:ml-10 uppercase">
                                            {project.project.title}
                                        </h1>
                                        <img
                                            src={project.project.photo}
                                            alt={project.project.title}
                                            className="h-[100px]"
                                        />
                                    </div>



                                </a>
                            );
                        })}
                    </div>
                </div>
                <Footer />
            </PageBody>
        </div>
    );
}
