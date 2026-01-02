"use client"
import React, { useEffect, useState } from 'react';
import PageBody from "@/app/components/pagebody/pagebody";
import PageTitle from "@/app/components/pagetitle/pagetitle";
import Footer from "@/app/components/footer/footer";

interface Profesor {
    nume: string;
}

interface ConsiliuProfesoral {
    profesori: {
        content: Profesor[];
    };
}


const ConsiliuProfesoral = () => {

    const [profesori, setProfesori] = useState<Profesor[]>([]);

    useEffect(() => {
        const fetchProfesori = async () => {
            const response = await fetch('/api/consiliu-profesoral');
            const data = await response.json();
            setProfesori(data.profesori || []);
        };

        fetchProfesori();
    }, []);

    const sortedProfesori = [...profesori].sort((a, b) => a.nume.localeCompare(b.nume));
    const currentYear = new Date().getFullYear();
    const totalItems = sortedProfesori.length + 1;

    return (
        <div>
            <PageBody>
                <PageTitle text="CONSILIU PROFESORAL"></PageTitle>

                <ul className="mt-16 lg:mt-24 self-center shadow-2xl lg:p-10 p-2  rounded-2xl w-full lg:w-[1000px] border-2">
                    <p className="lg:text-5xl text-3xl font-bold text-indigo-900 lg:mb-4 mb-2">{currentYear}</p>

                    <div
                        className="animate-fadeIn opacity-0"
                        style={{ animationDelay: `0ms` }}
                    >
                        <hr className="solid border-t-2" />
                    </div>

                    {sortedProfesori.map((profesor, index) => {
                        const delay = `${index * 40}ms`;
                        return (
                            <div
                                key={index}
                                className="animate-fadeIn opacity-0"
                                style={{ animationDelay: delay }}
                            >
                                <li className="lg:text-3xl text-xl font-bold">
                                    <div className="flex">
                                        <div className="lg:w-16 w-8 mt-0.5 ">{index + 1}</div>
                                        <p className="pt-0.5 pb-0.5">{profesor.nume}</p>
                                    </div>

                                    <div
                                        className="animate-fadeIn opacity-0"
                                        style={{ animationDelay: `${(index + 1) * 40}ms` }}
                                    >
                                        <hr className="solid border-t-2" />
                                    </div>
                                </li>
                            </div>
                        );
                    })}


                </ul>
                <Footer />
            </PageBody>
        </div>

    );
};

export default ConsiliuProfesoral;
