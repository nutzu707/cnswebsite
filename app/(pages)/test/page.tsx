"use client";

import { useState } from "react";
import React from "react";
import { motion } from "framer-motion";
import PageBody from "@/app/components/pagebody/pagebody";


export default function Test() {
    return (
        <main className="relative w-full min-h-screen flex items-start md:items-center justify-center px-4 py-10  font-bold">
            <div className="relative gap-5 flex flex-col items-center justify-center  w-full">
                <One />
            </div>
        </main>
    );
}

const One = () => {
    type Props = {
        id: number;
        tile: string;
    };

    const ITEMS: Props[] = [
        { id: 1, tile: "Prezentare" },
        { id: 2, tile: "management" },
        { id: 3, tile: "elevi" },
        { id: 4, tile: "profesori" },
        { id: 5, tile: "examene" },
        { id: 6, tile: "proiecte" },
        { id: 7, tile: "contact" },
    ];

    const [active, setActive] = useState<Props>(ITEMS[0]);
    const [isHover, setIsHover] = useState<Props | null>(null);

    const divs = {
        1: (
            <div className="bg-blue-100 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold">Prezentare</h2>
                <p>This is the Prezentare content with full styling.</p>
            </div>
        ),
        2: (
            <div className="bg-green-100 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold">Management</h2>
                <p>This is the Management content with full styling.</p>
            </div>
        ),
        3: (
            <div className="bg-red-100 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold">Elevi</h2>
                <p>This is the Elevi content with full styling.</p>
            </div>
        ),
        4: (
            <div className="bg-yellow-100 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold">Profesori</h2>
                <p>This is the Profesori content with full styling.</p>
            </div>
        ),
        5: (
            <div className="bg-purple-100 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold">Examene</h2>
                <p>This is the Examene content with full styling.</p>
            </div>
        ),
        6: (
            <div className="bg-teal-100 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold">Proiecte</h2>
                <p>This is the Proiecte content with full styling.</p>
            </div>
        ),
        7: (
            <div className="bg-pink-100 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold">Contact</h2>
                <p>This is the Contact content with full styling.</p>
            </div>
        ),
    };

    return (
        <PageBody>
        <div className="w-full">
            <ul className="flex items-center justify-center select-none border-b border-t border-gray-200">
                {ITEMS.map((item) => (
                    <button
                        key={item.id}
                        className="py-2 relative duration-300 transition-colors hover:!text-black uppercase"
                        onClick={() => setActive(item)}
                        onMouseEnter={() => setIsHover(item)}
                        onMouseLeave={() => setIsHover(null)}
                        style={{ color: active.id === item.id ? "#000" : "#888888" }}
                    >
                        <div className="px-5 py-2 relative">
                            {item.tile}
                            {isHover?.id === item.id && (
                                <motion.div
                                    layoutId="hover-bg"
                                    className="absolute bottom-0 left-0 right-0 w-full h-full bg-black/10 "
                                    style={{
                                        borderRadius: 6,
                                    }}
                                    transition={{ duration: .15 }}
                                />
                            )}
                        </div>
                        {active.id === item.id && (
                            <motion.div
                                layoutId="active"
                                className="absolute -bottom-[1px] left-0 right-0 w-full h-0.5 bg-black "
                                transition={{ duration: .15 }}
                            />
                        )}
                    </button>
                ))}
            </ul>
            <div className="mt-16">{divs[active.id]}</div>
        </div>
        </PageBody>
    );
};
