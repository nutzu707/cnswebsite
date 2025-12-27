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
                    <div className="bg-[url('/websiteUI/schita-liceu-blurred.png')] bg-cover bg-right w-full flex h-[500px] rounded-2xl mt-48 shadow-2xl border-solid border-2 lg:bg-[url('/websiteUI/schita-liceu.png')] ">
                        <div className="w-full mt-32 justify-center text-center lg:text-left lg:ml-16 lg:w-[470px]">
                            <h1 className="text-3xl font-bold md:text-5xl">
                                COLEGIUL NATIONAL
                            </h1>
                            <h1 className="text-7xl font-bold text-indigo-900 -mt-2 md:text-8xl">
                                SILVANIA
                            </h1>
                            <h1 className="text-lg font-bold -mt-1 md:text-2xl">
                                Performanță și excelență prin integrarea tradiției în modernitate!

                            </h1>
                            <Link href="/prezentare" className="self-center">
                                <Button className="text-xl rounded-md shadow-xl bg-indigo-900 text-white border-2 border-solid hover:bg-indigo-950 font-bold mt-8">Prezentare</Button>
                            </Link>
                        </div>
                    </div>
                </div>
                



                <div id="anunturi"></div>
                <PageTitle text="ANUNȚURI" />
                {loading ? (
                    <div className="text-center mt-16 lg:mt-24 text-2xl">Loading...</div>
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
