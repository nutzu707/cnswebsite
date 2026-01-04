/* eslint-disable @next/next/no-img-element */
"use client";

import PageBody from "@/app/components/pagebody/pagebody";
import PageTitle from "@/app/components/pagetitle/pagetitle";
import Footer from "@/app/components/footer/footer";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface CatedraPhoto {
    filename: string;
    url: string;
    label: string;
    uploadedAt: string;
    size: number;
    pathname: string;
}

export default function Catedre() {
    const [photos, setPhotos] = useState<CatedraPhoto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/catedre');
                const data = await response.json();
                setPhotos(data.photos || []);
            } catch (error) {
                console.error('Error fetching catedre photos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPhotos();
    }, []);

    return (
        <div>
            <PageBody>
                <PageTitle text="CATEDRE"/>
                
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
                    </div>
                ) : photos.length === 0 ? (
                    <div className="text-center py-20 text-xl text-gray-500">
                        Nu sunt fotografii disponibile
                    </div>
                ) : (
                    photos.map((photo, index) => (
                        <div key={photo.pathname} className={index === 0 ? "mt-16 lg:mt-24" : "lg:mt-16 mt-8"}>
                            <h1 className="lg:hidden block text-center text-2xl font-bold">{photo.label}</h1>
                            <div className="w-full relative aspect-[1400/500]">
                                <img 
                                    src={photo.url} 
                                    alt={photo.label} 
                                    className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl border-2 shadow-2xl" 
                                />
                                <div className="absolute inset-x-0 justify-center lg:items-end items-start bottom-0 lg:pb-4 pt-2 hidden lg:flex">
                                    <span className="bg-white lg:text-5xl text-xl font-bold lg:p-4 p-2 rounded-xl border-2 shadow-2xl">
                                        {photo.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                <Footer/>
            </PageBody>
        </div>
    );
}
