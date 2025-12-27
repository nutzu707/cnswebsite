/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import PageTitle from "@/app/components/pagetitle/pagetitle";
import PageBody from "@/app/components/pagebody/pagebody";
import Footer from "@/app/components/footer/footer";

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
                    <div className="text-center mt-16 lg:mt-24 text-2xl">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-2 place-items-center">
                        {people.map((person, index) => (
                            <div key={index} className="text-center mt-16 lg:mt-24">
                                <img
                                    className="w-[300px] rounded-full border-2 h-[300px] object-cover shadow-2xl"
                                    src={person.photo}
                                    alt={person.name}
                                />
                                <p className="font-bold text-3xl mt-4 uppercase">{person.name}</p>
                                <p className="font-bold text-xl text-indigo-900 uppercase">{person.position}</p>
                            </div>
                        ))}
                    </div>
                )}
                <Footer />
            </PageBody>
        </div>
    );
}
