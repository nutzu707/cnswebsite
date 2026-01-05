'use client';

/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';

const NewsBox = ({ newsItems }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const sortedNewsItems = [...newsItems].sort((a, b) => new Date(b.date) - new Date(a.date));

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItems = sortedNewsItems.slice(indexOfFirstItem, indexOfLastItem);

    const nextPage = () => {
        if (currentPage * itemsPerPage < sortedNewsItems.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="self-center pt-16 lg:pt-32 space-y-10">
            {currentItems.map((item, index) => (
                <a
                    href={item.link}
                    key={index}
                    className="group flex flex-col shadow-lg rounded-2xl w-full lg:min-h-0 lg:w-[1000px] lg:h-[259px] cursor-pointer lg:flex-row border-2 border-solid border-gray-200 bg-white transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:border-indigo-900 overflow-hidden"
                >
                    <div className="w-full aspect-[16/9] lg:w-[450px] lg:h-[255px] overflow-hidden">
                        <img
                            src={item.image}
                            className="w-full aspect-[16/9] lg:h-[255px] bg-no-repeat bg-cover bg-center object-cover rounded-t-[14px] lg:rounded-tr-none lg:rounded-l-[14px] transition-transform duration-500 group-hover:scale-110"
                            alt={`News ${index}`}
                        />
                    </div>
                    <div className="w-full lg:w-[550px] flex items-center bg-white transition-all duration-300">
                        <div className="mb-2 mt-2 ml-3 lg:ml-5 lg:mb-0">
                            <h1 className="font-bold uppercase text-2xl lg:text-3xl mr-5 text-gray-900">{item.title}</h1>
                            <div className="flex items-center gap-2 mt-2 lg:mt-1">
                                <div className="w-2 h-2 bg-indigo-900 rounded-full"></div>
                                <h1 className="text-indigo-900 font-bold text-sm">{formatDate(item.date)}</h1>
                            </div>
                        </div>
                    </div>
                </a>
            ))}
            <div className="flex justify-center gap-3 pt-2 lg:pt-12">
                <button
                    onClick={prevPage}
                   /* disabled={currentPage === 1} */ 
                    className="text-white shadow-lg bg-indigo-900 rounded-lg px-6 py-2 hover:bg-indigo-950 flex items-center gap-2 font-bold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                    ← ÎNAPOI
                </button>
                <button
                    onClick={nextPage}
                   /* disabled={currentPage * itemsPerPage >= sortedNewsItems.length} */ 
                    className="text-white shadow-lg bg-indigo-900 rounded-lg px-6 py-2 hover:bg-indigo-950 flex items-center gap-2 font-bold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                    ÎNAINTE →
                </button>
            </div>
        </div>
    );
};

export default NewsBox;
