"use client";

/* eslint-disable @next/next/no-img-element */
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
    imageUrl?: string;
    imageData?: string; // Legacy support
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`/api/news/${anunt}`);
                
                if (!response.ok) {
                    throw new Error('Article not found');
                }
                
                const data = await response.json();
                setArticle(data.article);
            } catch (error) {
                console.error('Error loading the article:', error);
                setError('Failed to load article. It may have been deleted or moved.');
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [anunt]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    if (loading) {
        return (
            <div className="w-full flex justify-center flex-col animate-pulse">
                <div className="lg:w-[725px] w-full self-center">
                    <div className="mt-32 flex mb-4">
                        <div className="w-6 h-6 bg-gray-300 rounded"></div>
                        <div className="ml-2 w-40 h-6 bg-gray-300 rounded"></div>
                    </div>
                    <div className="h-12 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 w-32 bg-gray-300 rounded mb-4"></div>
                    <div className="w-full aspect-[16/9] bg-gray-300 rounded-xl mb-8"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="w-full flex justify-center flex-col">
                <div className="lg:w-[725px] w-full self-center mt-32">
                    <div className="bg-red-100 border-2 border-red-500 rounded-lg p-6 text-center">
                        <p className="text-xl font-bold text-red-800 mb-4">
                            {error || 'Article not found'}
                        </p>
                        <button
                            onClick={() => window.location.href = '/#anunturi'}
                            className="px-6 py-2 bg-indigo-900 text-white rounded-md hover:bg-indigo-950 font-bold"
                        >
                            Back to News
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex justify-center flex-col motion-safe:animate-fadeUp">
                <div className="lg:w-[725px] w-full self-center">
                    <div
                        className="mt-32 flex mb-6 cursor-pointer hover:text-indigo-900 transition-colors duration-200"
                        onClick={() => window.location.href = '/#anunturi'}
                    >
                        <ArrowLeftSquare className="transition-transform duration-200 hover:-translate-x-1" />
                        <a className="ml-2 font-semibold">Înapoi la anunțuri</a>
                    </div>
                    
                    <h1 className="lg:text-5xl text-3xl font-bold text-indigo-900 leading-tight">
                        {article.title}
                    </h1>
                    
                    <div className="flex items-center gap-2 mt-4 mb-6">
                        <div className="w-2 h-2 bg-indigo-900 rounded-full"></div>
                        <p className="text-sm font-bold text-gray-600">
                            {formatDate(article.post_date)}
                        </p>
                    </div>
                    
                    <img
                        src={article.thumbnail}
                        alt={`${article.title} thumbnail`}
                        className="mt-4 lg:w-[725px] lg:h-[405px] w-full aspect-[16/9] rounded-xl shadow-2xl border-solid object-cover mb-8 border-2 transition-transform duration-300 hover:scale-[1.02]"
                    />
                    
                    <div className="article-content space-y-6">
                        {article.content.map((item, index) => {
                            if (item.type === 'paragraph') {
                                return (
                                    <p key={index} className="text-lg leading-relaxed text-gray-800">
                                        {item.text}
                                    </p>
                                );
                            } else if (item.type === 'image') {
                                return (
                                    <div key={index} className="article-image my-8">
                                        <img
                                            src={item.imageUrl || item.imageData || ''} 
                                            alt={item.caption || `Image ${index}`}
                                            className="lg:w-[725px] lg:h-[405px] w-full aspect-[16/9] rounded-xl shadow-2xl border-solid object-cover border-2 transition-transform duration-300 hover:scale-[1.02]"
                                        />
                                        {item.caption && (
                                            <p className="text-sm font-semibold text-gray-600 mt-3 text-center italic">
                                                {item.caption}
                                            </p>
                                        )}
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                    
                    <div className="mt-12 mb-8">
                        <button
                            onClick={() => window.location.href = '/#anunturi'}
                            className="w-full lg:w-auto px-8 py-3 bg-indigo-900 text-white rounded-lg hover:bg-indigo-950 font-bold shadow-lg transition-all duration-200 hover:shadow-xl"
                        >
                            Înapoi la toate anunțurile
                        </button>
                    </div>
                </div>
                <Footer></Footer>
                
        </div>
    );
};

export default NewsArticleDisplay;
