/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import PageBody from "@/app/components/pagebody/pagebody";
import PageTitle from "@/app/components/pagetitle/pagetitle";
import NewsBox from "@/app/components/newsbox/newsbox";
import Footer from "@/app/components/footer/footer";
import { Button } from "@/components/ui/button";

interface NewsItem {
    title: string;
    date: string;
    image: string;
    link: string;
}

export default function Home() {
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch("/api/news");
                const data = await response.json();
                setNewsItems(data.newsItems || []);
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const scrollToAnunturi = () => {
        const section = document.getElementById("anunturi");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div>
            <section className="relative isolate min-h-[100svh] w-full overflow-hidden bg-brand-cream">
                <div className="absolute inset-0 motion-safe:animate-fadeIn">
                    <img
                        src="/websiteUI/schita-liceu.png"
                        alt="Schița clădirii Colegiului Național Silvania"
                        className="h-full w-full object-cover object-[70%_center] sm:object-right"
                    />
                    {/* Mobile readability wash — sketch stays visible without covering the copy */}
                    <div
                        className="absolute inset-0 bg-gradient-to-b from-brand-cream via-brand-cream/85 to-brand-cream/40 lg:hidden"
                        aria-hidden
                    />
                    <div
                        className="absolute inset-0 hidden bg-gradient-to-r from-brand-cream via-brand-cream/30 to-transparent lg:block"
                        aria-hidden
                    />
                </div>

                <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1400px] flex-col justify-center px-5 pb-16 pt-28 sm:px-8 lg:pb-24 lg:pt-32">
                    <div className="max-w-xl text-center lg:text-left">
                        <p
                            className="text-[clamp(1.75rem,8vw,3rem)] font-bold tracking-[0.06em] text-gray-800 opacity-0 motion-safe:animate-fadeInUp lg:text-5xl"
                            style={{ animationDelay: "80ms" }}
                        >
                            COLEGIUL NAȚIONAL
                        </p>
                        <h1
                            className="mt-1 text-[clamp(3.75rem,18vw,7.5rem)] font-bold leading-[0.9] tracking-tight text-indigo-900 opacity-0 motion-safe:animate-fadeInUp"
                            style={{ animationDelay: "180ms" }}
                        >
                            SILVANIA
                        </h1>
                        <div
                            className="mx-auto mt-5 h-[3px] w-24 origin-center rounded-full bg-indigo-900 opacity-0 motion-safe:animate-fadeInUp lg:mx-0 lg:origin-left"
                            style={{ animationDelay: "280ms" }}
                            aria-hidden
                        />
                        <p
                            className="mt-6 max-w-md text-base font-bold leading-snug text-gray-700 opacity-0 motion-safe:animate-fadeInUp sm:text-lg md:text-2xl lg:max-w-lg"
                            style={{ animationDelay: "360ms" }}
                        >
                            Performanță și excelență prin integrarea tradiției în modernitate!
                        </p>

                        <div
                            className="mt-8 flex w-full flex-col items-stretch gap-3 opacity-0 motion-safe:animate-fadeInUp sm:mt-10 sm:items-center lg:flex-row lg:items-start"
                            style={{ animationDelay: "460ms" }}
                        >
                            <Link href="/prezentare" className="w-full sm:w-auto">
                                <Button className="h-auto w-full rounded-lg bg-indigo-900 px-7 py-3.5 text-xl font-bold text-brand-cream shadow-md transition duration-300 hover:bg-indigo-950 hover:shadow-lg sm:w-auto">
                                    Prezentare
                                </Button>
                            </Link>
                            <Button
                                type="button"
                                onClick={scrollToAnunturi}
                                className="h-auto w-full rounded-lg border-2 border-indigo-900 bg-brand-paper/80 px-7 py-3.5 text-xl font-bold text-indigo-900 transition duration-300 hover:bg-brand-paper sm:w-auto"
                            >
                                Anunțuri
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <PageBody>
                <div id="anunturi"></div>
                <PageTitle text="ANUNȚURI" />
                {loading ? (
                    <div className="self-center space-y-10 pt-16 lg:pt-32">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="flex w-full animate-pulse flex-col rounded-2xl border-2 border-solid border-gray-200 bg-brand-paper shadow-lg lg:h-[259px] lg:w-[1000px] lg:flex-row"
                            >
                                <div className="aspect-[16/9] w-full rounded-t-2xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 lg:h-[255px] lg:w-[450px] lg:rounded-l-2xl lg:rounded-tr-none"></div>
                                <div className="flex w-full items-center p-6 lg:w-[550px]">
                                    <div className="w-full space-y-3">
                                        <div className="h-8 w-3/4 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
                                        <div className="h-6 w-1/4 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : newsItems.length === 0 ? (
                    <div className="mt-16 text-center lg:mt-24">
                        <div className="mx-auto max-w-md rounded-2xl border-2 border-indigo-900 bg-brand-paper p-12 shadow-lg">
                            <p className="text-2xl font-bold text-indigo-900">
                                Nu există anunțuri momentan
                            </p>
                            <p className="mt-2 text-gray-700">
                                Reveniți mai târziu pentru noutăți!
                            </p>
                        </div>
                    </div>
                ) : (
                    <NewsBox newsItems={newsItems} />
                )}

                <Footer />
            </PageBody>

            <div className="hidden">
                <div>
                    <div>
                        <a
                            className="hidden"
                            href="https://mapmyvisitors.com/web/1bwqe"
                            title="Visit tracker"
                        >
                            <img
                                src="https://mapmyvisitors.com/map.png?d=jy7RLJNYyh74_lCX7eiKSRvlgJ7ePOm44yTv9cAMc4U&cl=ffffff"
                                alt="Map visitor tracker"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
