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
                    <button className="text-black px-2 py-0.5 rounded-md hover:bg-gray-200 flex items-center font-bold text-xl">
                        {title}
                    </button>
                </Link>
            </div>
        );
    }

    if (options && options.length > 0) {
        return (
            <div className="relative inline-block group">
                <button className="text-black px-2 py-0.5 rounded-md hover:bg-gray-200 flex items-center font-bold text-xl">
                    {title}
                </button>

                <div className="absolute  left-0 p-1 bg-white border-2 shadow-2xl opacity-0 transform scale-y-0 origin-top transition-all duration-150 ease-out group-hover:opacity-100 group-hover:scale-y-100 rounded-xl">
                    <ul>
                        {options.map((option, index) => {
                            const isExternal = option.link.startsWith('http');
                            return (
                                <li
                                    key={index}
                                    className=" px-2 hover:bg-gray-100 cursor-pointer font-bold text-xl rounded-md whitespace-nowrap "
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
            <button className="text-black px-2 py-0.5 rounded-md hover:bg-gray-200 flex items-center font-bold text-xl">
                {title}
            </button>
        </div>
    );
};

export default NavbarButton;

