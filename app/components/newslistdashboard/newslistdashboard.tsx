"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface NewsArticle {
    title: string;
    date: string;
    image: string;
    link: string;
    url: string;
}

const NewsListDashboard = () => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/news');
            const data = await response.json();
            setArticles(data.newsItems || []);
        } catch (error) {
            console.error('Error fetching news:', error);
            setArticles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleDelete = async (article: NewsArticle) => {
        if (!confirm(`Are you sure you want to delete "${article.title}"?`)) {
            return;
        }

        try {
            // Extract the pathname from the URL to delete
            const response = await fetch(
                `/api/blob/delete?url=${encodeURIComponent(article.url)}`,
                { method: 'DELETE' }
            );

            if (response.ok) {
                console.log('Delete successful');
                await fetchArticles();
            } else {
                throw new Error('Delete failed');
            }
        } catch (error) {
            console.error('Error deleting article:', error);
            alert('Failed to delete article');
        }
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Button
                    type="button"
                    onClick={fetchArticles}
                    className="text-xl rounded-md shadow-xl bg-white text-black border-2 border-solid hover:bg-gray-200 font-bold"
                >
                    Refresh
                </Button>
            </div>

            <div className="h-[300px] overflow-y-scroll pr-5">
                {loading ? (
                    <div className="text-xl">Loading...</div>
                ) : articles.length === 0 ? (
                    <div className="text-xl">No articles available</div>
                ) : (
                    <ul>
                        {articles.map((article, index) => (
                            <li key={index} className="flex w-full border-t-2 text-2xl py-4">
                                <div className="flex-1 break-all content-center">
                                    <div className="font-bold">{article.title}</div>
                                    <div className="text-sm text-gray-600 font-semibold mt-1">
                                        {formatDate(article.date)}
                                    </div>
                                </div>
                                <div className="flex gap-2 content-center">
                                    <Button
                                        onClick={() => window.open(article.link, '_blank')}
                                        className="text-xl rounded-md shadow-xl bg-blue-600 text-white border-2 border-solid hover:bg-blue-700 font-bold"
                                    >
                                        View
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(article)}
                                        className="text-xl rounded-md shadow-xl bg-white text-black border-2 border-solid hover:bg-red-200 font-bold"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                <hr className="solid border-t-2" />
            </div>
        </div>
    );
};

export default NewsListDashboard;

