"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";

interface CatedraPhoto {
    filename: string;
    url: string;
    label: string;
    uploadedAt: string;
    size: number;
    pathname: string;
}

interface CatedraSection {
    filename: string;
    label: string;
}

const CatedreManager = () => {
    const [photos, setPhotos] = useState<CatedraPhoto[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState<string | null>(null);

    const catedre: CatedraSection[] = [
        { filename: 'informatica.jpg', label: 'INFORMATICĂ' },
        { filename: 'matematica.jpg', label: 'MATEMATICĂ' },
        { filename: 'limba-romana.jpg', label: 'LIMBA ROMANĂ' },
        { filename: 'stiinte.jpg', label: 'ȘTIINȚE' },
        { filename: 'limbi-moderne.jpg', label: 'LIMBI MODERNE' },
        { filename: 'istorie-socio-arte-sport.jpg', label: 'ISTORIE SOCIO ARTE SPORT' },
        { filename: 'personal-auxiliar.jpg', label: 'PERSONAL AUXILIAR' },
    ];

    const fetchPhotos = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/catedre');
            const data = await response.json();
            setPhotos(data.photos || []);
        } catch (error) {
            console.error('Error fetching photos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    const handleUpload = async (catedra: CatedraSection, file: File) => {
        setUploading(catedra.filename);
        
        try {
            const response = await fetch(
                `/api/blob/upload?filename=${encodeURIComponent(catedra.filename)}&folder=catedre-photos&overwrite=true`,
                {
                    method: 'POST',
                    body: file,
                }
            );

            if (response.ok) {
                alert(`${catedra.label} photo uploaded successfully!`);
                await fetchPhotos();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading photo:', error);
            alert(error instanceof Error ? error.message : 'Failed to upload photo');
        } finally {
            setUploading(null);
        }
    };

    const handleFileSelect = (catedra: CatedraSection, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleUpload(catedra, file);
            // Reset input
            e.target.value = '';
        }
    };

    const getCurrentPhoto = (filename: string) => {
        return photos.find(p => p.filename === filename);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {catedre.map((catedra) => {
                const currentPhoto = getCurrentPhoto(catedra.filename);
                const isUploading = uploading === catedra.filename;

                return (
                    <div 
                        key={catedra.filename} 
                        className="border-2 rounded-xl p-4 bg-white shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Photo Preview */}
                            <div className="lg:w-1/3">
                                {currentPhoto ? (
                                    <div className="relative">
                                        <img 
                                            src={currentPhoto.url} 
                                            alt={catedra.label}
                                            className="w-full h-32 object-cover rounded-lg border-2"
                                        />
                                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                            ✓ Uploaded
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-32 bg-gray-100 rounded-lg border-2 border-dashed flex items-center justify-center text-gray-400">
                                        No photo uploaded
                                    </div>
                                )}
                            </div>

                            {/* Info & Upload */}
                            <div className="lg:w-2/3 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-indigo-900 mb-2">
                                        {catedra.label}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                        {currentPhoto 
                                            ? `Current photo: ${catedra.filename}`
                                            : 'No photo uploaded yet'
                                        }
                                    </p>
                                </div>

                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileSelect(catedra, e)}
                                        disabled={isUploading}
                                        id={`upload-${catedra.filename}`}
                                        className="hidden"
                                    />
                                    <label htmlFor={`upload-${catedra.filename}`}>
                                        <Button
                                            type="button"
                                            disabled={isUploading}
                                            className={`w-full cursor-pointer ${
                                                currentPhoto 
                                                    ? 'bg-indigo-600 hover:bg-indigo-700' 
                                                    : 'bg-green-600 hover:bg-green-700'
                                            }`}
                                            asChild
                                        >
                                            <span>
                                                {isUploading ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="w-5 h-5 mr-2" />
                                                        {currentPhoto ? 'Replace Photo' : 'Upload Photo'}
                                                    </>
                                                )}
                                            </span>
                                        </Button>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CatedreManager;
