"use client";

import React, { useEffect, useState } from "react";

interface StorageUsage {
    totalBytes: number;
    totalMB: number;
    storageLimit: number;
    percentageUsed: number;
    filesCount: number;
}

interface BlobStorageIndicatorProps {
    compact?: boolean;
}

const BlobStorageIndicator = ({ compact = false }: BlobStorageIndicatorProps) => {
    const [usage, setUsage] = useState<StorageUsage | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUsage = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/blob/usage");
            const data = await response.json();
            setUsage(data);
        } catch (error) {
            console.error("Error fetching storage usage:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsage();
        // Quietly ensure CORS in the background — no UI status banners
        fetch("/api/blob/setup-cors", { method: "POST" }).catch(() => {});
        const interval = setInterval(fetchUsage, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="rounded-2xl border border-indigo-900/10 bg-brand-paper p-5 shadow-sm">
                <p className="text-sm text-gray-600">Se încarcă stocarea...</p>
            </div>
        );
    }

    if (!usage) {
        return null;
    }

    const getColorClass = () => {
        if (usage.percentageUsed < 50) return "bg-emerald-500";
        if (usage.percentageUsed < 80) return "bg-amber-500";
        return "bg-red-500";
    };

    return (
        <div className="rounded-2xl border border-indigo-900/10 bg-brand-paper p-5 shadow-sm">
            <div className={`flex ${compact ? "flex-col gap-4" : "flex-col lg:flex-row lg:items-center"} gap-4`}>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-indigo-900">Stocare</h3>
                    <p className="mt-1 text-sm text-gray-600 font-normal">
                        <span className="font-bold text-indigo-950">{usage.totalMB.toFixed(2)} MB</span>
                        {" "}din{" "}
                        <span className="font-bold text-indigo-950">{usage.storageLimit.toFixed(0)} MB</span>
                        {" · "}
                        {usage.filesCount} fișiere
                    </p>
                </div>

                <div className="flex-1 w-full">
                    <div className="w-full bg-indigo-50 rounded-full h-3 overflow-hidden">
                        <div
                            className={`h-full ${getColorClass()} transition-all duration-500`}
                            style={{ width: `${Math.min(usage.percentageUsed, 100)}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 font-normal">
                        {usage.percentageUsed.toFixed(1)}% utilizat
                    </p>
                </div>

                <button
                    onClick={fetchUsage}
                    className="self-start rounded-xl bg-indigo-900 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-950"
                >
                    Refresh
                </button>
            </div>

            {usage.percentageUsed > 80 && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 font-bold">
                    Aproape de limita de stocare.
                </div>
            )}
        </div>
    );
};

export default BlobStorageIndicator;
