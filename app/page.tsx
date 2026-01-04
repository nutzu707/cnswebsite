/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import PageBody from "@/app/components/pagebody/pagebody";
import PageTitle from "@/app/components/pagetitle/pagetitle";
import NewsBox from "@/app/components/newsbox/newsbox";
import Footer from "@/app/components/footer/footer";
import {Button} from "@/components/ui/button";

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

    return (
        <div>
            <PageBody>
            <div className="motion-safe:animate-fadeUp group">
                    <div className="bg-[url('/websiteUI/schita-liceu-blurred.png')] bg-cover bg-right w-full flex h-[700px] rounded-2xl mt-48 shadow-2xl border-solid border-2 lg:bg-[url('/websiteUI/schita-liceu.png')] ">
                        <div className="w-full mt-56 justify-center text-center lg:text-left lg:ml-16 lg:w-[470px]">
                            <h1 className="text-3xl font-bold md:text-5xl">
                                COLEGIUL NATIONAL
                            </h1>
                            <h1 className="text-7xl font-bold text-indigo-900 -mt-2 md:text-8xl">
                                SILVANIA
                            </h1>
                            <h1 className="text-lg font-bold -mt-1 md:text-2xl">
                                Performanță și excelență prin integrarea tradiției în modernitate!
                            </h1>
                            <div className="flex flex-col items-center mt-8 lg:items-start lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                                <Link href="/prezentare" className="self-center lg:self-auto">
                                    <Button className="text-xl rounded-md shadow-xl bg-indigo-900 text-white border-indigo-800 border-2 border-solid hover:bg-indigo-950 font-bold">Prezentare</Button>
                                </Link>
                                <Button
                                    className="text-xl rounded-md shadow-xl bg-indigo-900 text-white border-indigo-800 border-2 border-solid hover:bg-indigo-950 font-bold"
                                    onClick={() => {
                                        const section = document.getElementById("anunturi");
                                        if (section) {
                                            section.scrollIntoView({ behavior: "smooth" });
                                        }
                                    }}
                                    type="button"
                                >
                                    Anunțuri
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                



                <div id="anunturi"></div>
                <PageTitle text="ANUNȚURI" />
                {loading ? (
                    <div className="self-center pt-16 lg:pt-32 space-y-10">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex flex-col shadow-2xl rounded-2xl w-full lg:w-[1000px] lg:h-[259px] lg:flex-row border-2 border-solid border-gray-200 animate-pulse">
                                <div className="w-full aspect-[16/9] lg:w-[450px] lg:h-[255px] bg-gray-300 rounded-t-2xl lg:rounded-tr-none lg:rounded-l-2xl"></div>
                                <div className="w-full lg:w-[550px] flex items-center p-6">
                                    <div className="w-full space-y-3">
                                        <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                                        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : newsItems.length === 0 ? (
                    <div className="text-center mt-16 lg:mt-24">
                        <div className="bg-gray-100 border-2 border-gray-300 rounded-2xl p-12 max-w-md mx-auto">
                            <p className="text-2xl font-bold text-gray-600">Nu există anunțuri momentan</p>
                            <p className="text-gray-500 mt-2">Reveniți mai târziu pentru noutăți!</p>
                        </div>
                    </div>
                ) : (
                    <NewsBox newsItems={newsItems}/>
                )}

                <Footer />
            </PageBody>

              <div className="hidden">
                    <div>
                        <div>
                        <a className="hidden" href="https://mapmyvisitors.com/web/1bwqe"  title="Visit tracker"><img src="https://mapmyvisitors.com/map.png?d=jy7RLJNYyh74_lCX7eiKSRvlgJ7ePOm44yTv9cAMc4U&cl=ffffff" alt="Map visitor tracker" /></a>
                        </div>
                    </div>
                </div>
        </div>
    );
}
