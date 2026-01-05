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
            const response = await fetch("/api/diriginti");
            const data = await response.json();
            setDiriginti(data.diriginti || []);
        };

        fetchDiriginti();
    }, []);

    const sortedDiriginti = [...diriginti].sort((a, b) => a.nume.localeCompare(b.nume));

    return (
        <div>
            <PageBody>
                <PageTitle text="DIRIGINTI"></PageTitle>

                <div className="mt-16 lg:mt-24 self-center shadow-lg bg-white lg:p-8 p-4 rounded-2xl w-full lg:w-[1000px] border-2 border-gray-200">
                    <div
                        className="animate-fadeIn opacity-0"
                        style={{ animationDelay: `0ms` }}
                    >
                        <hr className="border-t-2 border-gray-200" />
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
                                    <hr className="border-t-2 border-gray-200" />
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
