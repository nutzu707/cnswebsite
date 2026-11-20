"use client";

import React, { useEffect, useState } from "react";
import { ExternalLink, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { parseJsonResponse } from "@/lib/upload-client";

interface NewsArticle {
    title: string;
    date: string;
    image: string;
    link: string;
    url: string;
    pathname?: string;
}

const NewsListDashboard = () => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return dateString;
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/news");
            const data = await response.json();
            setArticles(data.newsItems || []);
        } catch (error) {
            console.error("Error fetching news:", error);
            setArticles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
        const onChanged = () => fetchArticles();
        window.addEventListener("dashboard-news-changed", onChanged);
        return () => window.removeEventListener("dashboard-news-changed", onChanged);
    }, []);

    const handleDelete = async (article: NewsArticle) => {
        if (!confirm(`Ștergi „${article.title}”?`)) return;

        try {
            const deleteParam = article.pathname
                ? `pathname=${encodeURIComponent(article.pathname)}`
                : `url=${encodeURIComponent(article.url)}`;
            const response = await fetch(`/api/blob/delete?${deleteParam}`, { method: "DELETE" });
            if (!response.ok) {
                const errorData = await parseJsonResponse<{ error?: string }>(response);
                throw new Error(errorData.error || "Delete failed");
            }
            await fetchArticles();
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to delete article");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-indigo-900">Publicate</p>
                <button
                    type="button"
                    onClick={fetchArticles}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-900/15 px-2.5 py-1.5 text-xs font-bold text-indigo-900 hover:bg-indigo-50"
                >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="flex items-center gap-2 py-8 text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Se încarcă...
                </div>
            ) : articles.length === 0 ? (
                <p className="rounded-xl border border-dashed border-indigo-900/15 px-4 py-10 text-center text-sm text-gray-500">
                    Niciun anunț publicat.
                </p>
            ) : (
                <ul className="space-y-2 max-h-[640px] overflow-y-auto">
                    {articles.map((article, index) => (
                        <li
                            key={`${article.url}-${index}`}
                            className="flex items-center gap-3 rounded-xl border border-indigo-900/10 bg-indigo-50/30 px-3 py-3"
                        >
                            {article.image && (
                                <img
                                    src={article.image}
                                    alt=""
                                    className="h-14 w-20 rounded-lg object-cover shrink-0"
                                />
                            )}
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-indigo-950">{article.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{formatDate(article.date)}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => window.open(article.link, "_blank")}
                                    className="rounded-lg p-2 text-indigo-900 hover:bg-white"
                                    title="Vezi"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(article)}
                                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                                    title="Șterge"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NewsListDashboard;
