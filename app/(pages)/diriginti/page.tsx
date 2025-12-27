"use client";

import React, { useEffect, useState } from "react";
import PageBody from "@/app/components/pagebody/pagebody";
import PageTitle from "@/app/components/pagetitle/pagetitle";
import Footer from "@/app/components/footer/footer";

interface Diriginte {
    nume: string;
    clasa: string;
    sala: string;
}

interface DirigintiData {
    diriginti: {
        content: Diriginte[];
    };
}

const DirigintiPage = () => {
    const [diriginti, setDiriginti] = useState<Diriginte[]>([]);

    useEffect(() => {
        const fetchDiriginti = async () => {
            const response = await fetch("/assets/uploads/documents/diriginti.json");
            const data: DirigintiData = await response.json();
            setDiriginti(data.diriginti.content);
        };

        fetchDiriginti();
    }, []);

    const sortedDiriginti = [...diriginti].sort((a, b) => a.nume.localeCompare(b.nume));
    const currentYear = new Date().getFullYear();

    return (
        <div>
            <PageBody>
                <PageTitle text="DIRIGINTI"></PageTitle>

                <div className="mt-16 lg:mt-24 self-center shadow-2xl lg:p-10 p-2 rounded-2xl w-full lg:w-[1000px] border-2">
                    <p className="lg:text-5xl text-3xl font-bold text-indigo-900 lg:mb-4 mb-2">{currentYear}</p>

                    <div
                        className="animate-fadeIn opacity-0"
                        style={{ animationDelay: `0ms` }}
                    >
                        <hr className="solid border-t-2" />
                    </div>

                    {sortedDiriginti.map((diriginte, index) => {
                        const delay = `${index * 40}ms`;

                        return (
                            <div
                                key={index}
                                className="animate-fadeIn opacity-0"
                                style={{ animationDelay: delay }}
                            >
                                <div className="lg:text-3xl text-xl font-bold">
                                    <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                                        <div className="flex items-center uppercase w-full">
                                            <p className="pt-0.5 pb-0.5">{diriginte.nume}</p>
                                            <div className="ml-auto flex">
                                                <p className="lg:w-20 mr-2 text-left lg:text-right lg:mr-10">{diriginte.clasa}</p>
                                                <p className="lg:w-24  ml-auto lg:text-right">{diriginte.sala}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div
                                    className="animate-fadeIn opacity-0"
                                    style={{ animationDelay: `${(index + 1) * 40}ms` }}
                                >
                                    <hr className="solid border-t-2" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <Footer />
            </PageBody>
        </div>
    );
};

export default DirigintiPage;
