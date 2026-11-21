'use client';

import React from "react";
import Link from "next/link";

type Option = { title: string; link: string };
type Props = {
    title: string;
    options?: Option[];
    link?: string;
};

const NavbarButton: React.FC<Props> = ({ title, options, link }) => {
    if (link) {
        return (
            <div className="inline-block">
                <Link href={link} passHref>
                    <button className="flex items-center rounded-md px-2 py-0.5 text-xl font-bold text-black transition-colors hover:bg-gray-100">
                        {title}
                    </button>
                </Link>
            </div>
        );
    }

    if (options && options.length > 0) {
        return (
            <div className="group relative inline-block">
                <button className="flex items-center rounded-md px-2 py-0.5 text-xl font-bold text-black transition-colors hover:bg-gray-100">
                    {title}
                </button>

                <div className="absolute left-0 z-50 origin-top scale-y-0 transform rounded-xl border-2 border-gray-200 bg-brand-paper p-1 opacity-0 shadow-2xl transition-all duration-150 ease-out group-hover:scale-y-100 group-hover:opacity-100">
                    <ul>
                        {options.map((option, index) => {
                            const isExternal = option.link.startsWith('http');
                            return (
                                <li
                                    key={index}
                                    className="cursor-pointer whitespace-nowrap rounded-md px-2 text-xl font-bold text-black hover:bg-gray-100"
                                >
                                    {isExternal ? (
                                        <a href={option.link} target="_blank" rel="noopener noreferrer" className="block">
                                            {option.title}
                                        </a>
                                    ) : (
                                        <Link href={option.link} className="block">
                                            {option.title}
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <div className="inline-block">
            <button className="flex items-center rounded-md px-2 py-0.5 text-xl font-bold text-black transition-colors hover:bg-gray-100">
                {title}
            </button>
        </div>
    );
};

export default NavbarButton;
