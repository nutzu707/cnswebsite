/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from 'react';
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

export default function Proiecte() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/projects');
                const data = await response.json();
                setProjects(data.projects || []);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div>
            <PageBody>
                <PageTitle text="PROIECTE" />
                {loading ? (
                    <div className="mt-16 lg:mt-24 self-center space-y-[25px] lg:w-[1000px] w-full">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-full h-[100px] rounded-2xl shadow-2xl bg-gray-300 animate-pulse"></div>
                        ))}
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center mt-16 lg:mt-24">
                        <div className="bg-gray-100 border-2 border-gray-300 rounded-2xl p-12 max-w-md mx-auto">
                            <p className="text-2xl font-bold text-gray-600">Nu există proiecte momentan</p>
                            <p className="text-gray-500 mt-2">Reveniți mai târziu pentru noutăți!</p>
                        </div>
                    </div>
                ) : (
                    <div className="mt-16 lg:mt-24 self-center">
                        <div className="space-y-[25px] lg:w-[1000px] w-full">
                            {projects.map((project, index) => {
                                const bgColor = project.color; // Background color from JSON
                                const textColor = getContrastingTextColor(bgColor); // Get contrasting text color
                                const link = project.link ? ensureProtocol(project.link) : '#'; // Ensure the link has the correct protocol

                                return (
                                    <a
                                        key={index}
                                        href={link}
                                        target={project.link ? "_blank" : "_self"}
                                        rel="noopener noreferrer"
                                        className={`w-full h-[300px] lg:h-[100px] lg:flex cursor-pointer ${textColor} transition-all duration-300 hover:scale-[1.02]`}
                                    >
                                        <div className="w-full h-[100px] hover:shadow-3xl items-center hidden lg:flex rounded-2xl shadow-2xl transition-all duration-300" style={{ backgroundColor: bgColor }}>
                                            <h1 className="lg:text-5xl text-3xl font-bold lg:ml-10 uppercase">
                                                {project.title}
                                            </h1>
                                            <img
                                                src={project.photo}
                                                alt={project.title}
                                                className="lg:h-[95%] h-[100px] lg:ml-auto lg:mr-10 object-contain"
                                            />
                                        </div>

                                        <div className="w-full h-[200px] justify-center items-center flex flex-col lg:hidden rounded-2xl shadow-2xl mb-4 transition-all duration-300" style={{ backgroundColor: bgColor }}>
                                            <h1 className="lg:text-5xl text-3xl text-center px-4 font-bold lg:ml-10 uppercase">
                                                {project.title}
                                            </h1>
                                            <img
                                                src={project.photo}
                                                alt={project.title}
                                                className="h-[100px] object-contain"
                                            />
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}
                <Footer />
            </PageBody>
        </div>
    );
}
