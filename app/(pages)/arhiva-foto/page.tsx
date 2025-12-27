/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import PageTitle from "@/app/components/pagetitle/pagetitle";
import PageBody from "@/app/components/pagebody/pagebody";
import Footer from "@/app/components/footer/footer";

interface BlobFile {
    filename: string;
    url: string;
    uploadedAt: string;
    size: number;
    pathname: string;
}

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export default function ArhivaPage() {
    const [images, setImages] = useState<BlobFile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/blob/list?folder=arhiva-foto`);
                const data = await response.json();
                const imageFiles = (data.files || []).filter((file: BlobFile) =>
                    /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.filename)
                );
                setImages(shuffleArray(imageFiles));
            } catch (error) {
                console.error('Error fetching images:', error);
                setImages([]);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    return (
        <div>
            <PageBody>
                <PageTitle text="ARHIVA FOTO"></PageTitle>
                {loading ? (
                    <div className="mt-16 lg:mt-24 text-center text-2xl">Loading images...</div>
                ) : (
                    <div className="mt-16 lg:mt-24 justify-center " style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {images.map((image, index) => (
                            <div key={image.pathname} style={{ margin: 10 }}>
                                <a
                                    href={image.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src={image.url}
                                        alt={`image-${index}`}
                                        className="lg:w-[300px] md:w-[300px] w-full shadow-2xl rounded-xl border-2"
                                    />
                                </a>
                            </div>
                        ))}
                    </div>
                )}
                <Footer />
            </PageBody>
        </div>
    );
}
