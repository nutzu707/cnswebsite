"use client";

import { useEffect, useState } from 'react';
import Footer from "@/app/components/footer/footer";
import PageBody from "@/app/components/pagebody/pagebody";
import {
    ArrowBigLeft, ArrowBigLeftDash,
    ArrowLeft,
    ArrowLeftCircle,
    ArrowLeftCircleIcon,
    ArrowLeftFromLine,
    ArrowLeftIcon,
    ArrowLeftRight, ArrowLeftSquare
} from "lucide-react";
import {ThickArrowLeftIcon} from "@radix-ui/react-icons";

type ContentItem = {
    type: 'paragraph' | 'image';
    text?: string;
    url?: string;
    imageData?: string;
    caption?: string;
};

type Article = {
    title: string;
    post_date: string;
    thumbnail: string;
    content: ContentItem[];
};

const NewsArticleDisplay = ({ anunt }: { anunt: string }) => {
    const [article, setArticle] = useState<Article | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch(`/assets/news/${anunt}.json`);
                const data = await response.json();
                setArticle(data.article);
            } catch (error) {
                console.error('Error loading the article:', error);
            }
        };

        fetchArticle();
    }, [anunt]);

    if (!article) return <p>Loading article...</p>;

    return (
        <div className="w-full flex justify-center flex-col">
                <div className="lg:w-[725px] w-full self-center">
                    <div
                        className="mt-32 flex mb-4 cursor-pointer"
                        onClick={() => window.location.href = '/#anunturi'}
                    >
                        <ArrowLeftSquare />
                        <a className="ml-2">Inapoi la anunturi</a>
                    </div>
                    <h1 className="lg:text-5xl text-3xl  font-bold">{article.title}</h1>
                    <p className="text-sm font-bold text-gray-500 mt-4">{new Date(article.post_date).toLocaleDateString()}</p>
                    <img

                        src={article.thumbnail}
                        alt={`${article.title} thumbnail`}
                        className="mt-4 lg:w-[725px] lg:h-[405px] w-full aspect-[16/9] rounded-xl shadow-xl border-solid object-cover mb-8 border-2"
                    />
                    <div className="article-content">
                        {article.content.map((item, index) => {
                            if (item.type === 'paragraph') {
                                return (
                                    <p key={index} className="text-xl mt-4">
                                        {item.text}
                                    </p>
                                );
                            } else if (item.type === 'image') {
                                return (
                                    <div key={index} className="article-image">
                                        <img
                                            src={item.imageData || item.url} 
                                            alt={item.caption || `Image ${index}`}
                                            className="mt-4 lg:w-[725px] lg:h-[405px] w-full aspect-[16/9] rounded-xl shadow-xl border-solid object-cover border-2"

                                        />
                                        {item.caption && <p className="text-sm font-bold text-gray-500 mt-1">{item.caption}</p>}
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
                <Footer></Footer>
                
        </div>
    );
};

export default NewsArticleDisplay;
