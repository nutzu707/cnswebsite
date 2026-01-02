"use client";

import React, { useEffect, useState } from "react";

interface StorageUsage {
    totalBytes: number;
    totalMB: number;
    totalGB: number;
    storageLimit: number;
    percentageUsed: number;
    filesCount: number;
}

const BlobStorageIndicator = () => {
    const [usage, setUsage] = useState<StorageUsage | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUsage = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/blob/usage');
            const data = await response.json();
            setUsage(data);
        } catch (error) {
            console.error('Error fetching storage usage:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsage();
        
        // Refresh every 30 seconds
        const interval = setInterval(fetchUsage, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="lg:w-[1000px] w-full self-center mt-16 shadow-2xl p-6 rounded-2xl border-2 bg-white">
                <p className="text-xl">Loading storage usage...</p>
            </div>
        );
    }

    if (!usage) {
        return null;
    }

    const getColorClass = () => {
        if (usage.percentageUsed < 50) return "bg-green-500";
        if (usage.percentageUsed < 80) return "bg-yellow-500";
        return "bg-red-500";
    };

    const storageLimitMB = usage.storageLimit * 1024; // Convert GB to MB

    return (
        <div className="lg:w-[1000px] w-full self-center mt-16 shadow-2xl p-6 rounded-2xl border-2 bg-white">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-indigo-900 mb-2">Storage Available</h3>
                    <p className="text-lg">
                        <span className="font-bold">{usage.totalMB.toFixed(2)} MB</span> of{" "}
                        <span className="font-bold">{storageLimitMB.toFixed(0)} MB</span> used
                    </p>
                    <p className="text-md text-gray-600">
                        {usage.filesCount} file{usage.filesCount !== 1 ? 's' : ''} stored
                    </p>
                </div>
                
                <div className="flex-1 w-full">
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                        <div
                            className={`h-full ${getColorClass()} transition-all duration-500 flex items-center justify-center text-white text-sm font-bold`}
                            style={{ width: `${Math.min(usage.percentageUsed, 100)}%` }}
                        >
                            {usage.percentageUsed > 10 && `${usage.percentageUsed.toFixed(1)}%`}
                        </div>
                    </div>
                    {usage.percentageUsed < 10 && (
                        <p className="text-sm text-gray-600 mt-1 text-center">
                            {usage.percentageUsed.toFixed(1)}% used
                        </p>
                    )}
                </div>

                <button
                    onClick={fetchUsage}
                    className="px-4 py-2 bg-indigo-900 text-white rounded-md hover:bg-indigo-950 font-bold"
                >
                    Refresh
                </button>
            </div>

            {usage.percentageUsed > 80 && (
                <div className="mt-4 p-3 bg-red-100 border-2 border-red-500 rounded-lg">
                    <p className="text-red-800 font-bold">
                        ⚠️ Warning: You're approaching your storage limit!
                    </p>
                </div>
            )}
        </div>
    );
};

export default BlobStorageIndicator;

