'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { uploadToBlob } from '@/lib/upload-client';

interface NavbarLinksConfig {
    orar: string;
    premii: string;
}

const ModifyNavbarLinks = () => {
    const [config, setConfig] = useState<NavbarLinksConfig>({ orar: '', premii: '' });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState<string | null>(null);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const response = await fetch('/api/navbar-links');
            if (response.ok) {
                const data = await response.json();
                setConfig(data);
            }
        } catch (error) {
            console.error('Error loading navbar config:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveConfig = async (nextConfig: NavbarLinksConfig) => {
        try {
            const jsonBlob = new Blob([JSON.stringify(nextConfig, null, 2)], {
                type: 'application/json',
            });

            await uploadToBlob(jsonBlob, 'navbar-config.json', 'navbar-links', {
                overwrite: true,
                contentType: 'application/json',
            });

            setConfig(nextConfig);
            await fetchConfig();
            return true;
        } catch (error) {
            console.error('Error saving config:', error);
            throw error;
        }
    };

    const handleFileUpload = async (field: keyof NavbarLinksConfig, file: File) => {
        try {
            setUploading(field);
            const safeName = file.name.replace(/\s+/g, '_');

            const result = await uploadToBlob(file, safeName, 'navbar-links', {
                overwrite: true,
            });

            const nextConfig = {
                ...config,
                [field]: result.url,
            };
            await saveConfig(nextConfig);
            alert('Încărcat și salvat cu succes! Refresh pagina pentru a vedea schimbările.');
        } catch (error) {
            console.error('Upload failed', error);
            alert(`Încărcarea a eșuat: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setUploading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="rounded-xl shadow-lg border-2 p-6 bg-white">
                <h2 className="text-2xl font-bold mb-6">Configurare Linkuri Navbar</h2>
                
                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="block text-lg font-semibold">Orar (încarcă PDF)</label>
                        <input
                            type="file"
                            accept="application/pdf"
                            disabled={uploading !== null}
                            onChange={(e) => e.target.files && handleFileUpload('orar', e.target.files[0])}
                            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {uploading === 'orar' && (
                            <div className="flex items-center gap-2 text-indigo-600">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm">Se încarcă...</span>
                            </div>
                        )}
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Link curent:</p>
                            <p className="text-sm text-gray-700 break-all font-mono">
                                {config.orar || '(Niciun link setat)'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-lg font-semibold">Premii (încarcă PDF)</label>
                        <input
                            type="file"
                            accept="application/pdf"
                            disabled={uploading !== null}
                            onChange={(e) => e.target.files && handleFileUpload('premii', e.target.files[0])}
                            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {uploading === 'premii' && (
                            <div className="flex items-center gap-2 text-indigo-600">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm">Se încarcă...</span>
                            </div>
                        )}
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Link curent:</p>
                            <p className="text-sm text-gray-700 break-all font-mono">
                                {config.premii || '(Niciun link setat)'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModifyNavbarLinks;

