/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import PageTitle from "@/app/components/pagetitle/pagetitle";
import PageBody from "@/app/components/pagebody/pagebody";
import Footer from "@/app/components/footer/footer";
import { Loader2 } from "lucide-react";

interface Person {
    name: string;
    position: string;
    photo: string;
    order?: number;
}

export default function Conducere() {
    const [people, setPeople] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPeople = async () => {
            try {
                const response = await fetch("/api/conducere");
                const data = await response.json();
                const peopleData = data.people.map((item: { person: Person }) => item.person);
                
                // Sort by order (fallback to large number) then name
                peopleData.sort((a: Person, b: Person) => {
                    const ao = a.order ?? Number.MAX_SAFE_INTEGER;
                    const bo = b.order ?? Number.MAX_SAFE_INTEGER;
                    if (ao !== bo) return ao - bo;
                    return a.name.localeCompare(b.name);
                });
                
                setPeople(peopleData);
            } catch (error) {
                console.error("Error fetching conducere:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPeople();
    }, []);

    return (
        <div>
            <PageBody>
                <PageTitle text="CONDUCERE"></PageTitle>
                {loading ? (
                    <div className="flex flex-col items-center justify-center mt-16 lg:mt-24 text-2xl">
                        <Loader2 className="w-12 h-12 text-indigo-900 animate-spin mb-4" />
                        <p className="text-gray-600">Se încarcă...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8 place-items-center px-4 mt-16 lg:mt-24">
                        {people.map((person, index) => (
                            <div 
                                key={index} 
                                className="text-center w-full max-w-[320px]"
                            >
                                <div className="relative w-[300px] h-[300px] mx-auto mb-6">
                                    <img
                                        className="w-full h-full rounded-full border-2 border-gray-300 object-cover shadow-xl"
                                        src={person.photo}
                                        alt={person.name}
                                    />
                                </div>
                                <h3 className="font-bold text-2xl lg:text-3xl uppercase text-gray-900 mb-2">
                                    {person.name}
                                </h3>
                                <p className="font-bold text-xl text-indigo-900 uppercase">
                                    {person.position}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
                <Footer />
            </PageBody>
        </div>
    );
}
