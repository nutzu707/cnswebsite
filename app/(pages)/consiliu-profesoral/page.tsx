/* eslint-disable @next/next/no-img-element */
"use client"
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PageBody from "@/app/components/pagebody/pagebody";
import PageTitle from "@/app/components/pagetitle/pagetitle";
import Footer from "@/app/components/footer/footer";
import { Expand, X } from "lucide-react";

interface Profesor {
    nume: string;
}

const GROUP_PHOTO_SRC = "/images/consiliu-profesoral.jpg";
const GROUP_PHOTO_ALT =
    "Consiliul profesoral al Colegiului Național Silvania Zalău";

const ConsiliuProfesoral = () => {

    const [profesori, setProfesori] = useState<Profesor[]>([]);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const fetchProfesori = async () => {
            const response = await fetch('/api/consiliu-profesoral');
            const data = await response.json();
            setProfesori(data.profesori || []);
        };

        fetchProfesori();
    }, []);

    useEffect(() => {
        if (!lightboxOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setLightboxOpen(false);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [lightboxOpen]);

    const sortedProfesori = [...profesori].sort((a, b) => a.nume.localeCompare(b.nume));

    return (
        <div>
            <PageBody>
                <PageTitle text="CONSILIU PROFESORAL"></PageTitle>

                <figure
                    className="mt-12 lg:mt-16 w-full lg:w-[1000px] self-center animate-fadeIn opacity-0"
                    style={{ animationDelay: "0ms" }}
                >
                    <button
                        type="button"
                        onClick={() => setLightboxOpen(true)}
                        className="group relative block w-full overflow-hidden rounded-2xl border-2 border-gray-200 bg-brand-paper shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-900 focus-visible:ring-offset-2"
                        aria-label="Mărește fotografia consiliului profesoral"
                    >
                        <img
                            src={GROUP_PHOTO_SRC}
                            alt={GROUP_PHOTO_ALT}
                            width={1024}
                            height={680}
                            className="block h-auto w-full object-contain"
                            loading="eager"
                        />
                        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-gradient-to-t from-black/55 via-black/25 to-transparent px-4 pb-3 pt-10 text-sm font-semibold text-white opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100">
                            <Expand className="h-4 w-4" aria-hidden />
                            Apasă pentru a vedea toți profesorii mai clar
                        </span>
                    </button>
                    <figcaption className="mt-3 text-center text-sm text-gray-500 lg:text-base">
                        Consiliul profesoral — Colegiul Național „Silvania” Zalău
                    </figcaption>
                </figure>

                <ul className="mt-10 lg:mt-14 self-center shadow-lg bg-brand-paper lg:p-8 p-4 rounded-2xl w-full lg:w-[1000px] border-2 border-gray-200">
                    <div
                        className="animate-fadeIn opacity-0"
                        style={{ animationDelay: `0ms` }}
                    >
                        <hr className="border-t-2 border-gray-200" />
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
                                        <hr className="border-t-2 border-gray-200" />
                                    </div>
                                </li>
                            </div>
                        );
                    })}


                </ul>
                <Footer />
            </PageBody>

            {mounted && lightboxOpen && createPortal(
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 sm:p-6"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Fotografie mărită — Consiliu Profesoral"
                    onClick={() => setLightboxOpen(false)}
                >
                    <button
                        type="button"
                        onClick={() => setLightboxOpen(false)}
                        className="absolute right-4 top-4 z-[101] rounded-full bg-brand-paper/95 p-2 text-indigo-900 shadow-lg transition hover:bg-brand-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        aria-label="Închide fotografia"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    <div
                        className="max-h-[min(92vh,900px)] w-full max-w-[1400px] overflow-auto rounded-xl bg-black/20 shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <img
                            src={GROUP_PHOTO_SRC}
                            alt={GROUP_PHOTO_ALT}
                            width={1024}
                            height={680}
                            className="mx-auto h-auto w-full max-w-none object-contain md:min-w-[900px]"
                        />
                    </div>
                </div>,
                document.body
            )}
        </div>

    );
};

export default ConsiliuProfesoral;
