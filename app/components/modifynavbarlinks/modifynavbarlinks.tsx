'use client';

import { useState, useEffect } from 'react';

interface NavbarLinksConfig {
    orar: string;
    premii: string;
}

const ModifyNavbarLinks = () => {
    const [config, setConfig] = useState<NavbarLinksConfig>({ orar: '', premii: '' });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

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
            
            const response = await fetch(
                `/api/blob/upload?filename=${encodeURIComponent('navbar-config.json')}&folder=navbar-links`,
                {
                    method: 'POST',
                    body: jsonBlob,
                }
            );
            
            if (response.ok) {
                console.log('Config saved successfully:', nextConfig);
                setConfig(nextConfig);
                // Refresh config from server to ensure it's properly saved
                await fetchConfig();
            } else {
                console.error('Failed to save config:', response.status);
            }
        } catch (error) {
            console.error('Error saving config:', error);
        }
    };

    const handleFileUpload = async (field: keyof NavbarLinksConfig, file: File) => {
        try {
            setUploading(true);
            const safeName = file.name.replace(/\s+/g, '_');
            
            // Upload the file to blob storage
            const response = await fetch(
                `/api/blob/upload?filename=${encodeURIComponent(safeName)}&folder=navbar-links`,
                {
                    method: 'POST',
                    body: file,
                }
            );
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Upload failed:', response.status, errorText);
                throw new Error(`Upload failed: ${response.status} - ${errorText}`);
            }
            
            const result = await response.json();
            console.log('File uploaded:', result);
            
            // Update config with the blob URL
            const nextConfig = {
                ...config,
                [field]: result.url,
            };
            console.log('Saving new config:', nextConfig);
            await saveConfig(nextConfig);
            alert('Încărcat și salvat cu succes!');
        } catch (error) {
            console.error('Upload failed', error);
            alert(`Încărcarea a eșuat: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return <div className="text-center p-4">Se încarcă...</div>;
    }

    return (
        <div className="w-full">
            <div className="rounded-md shadow-2xl border-2 p-4 mb-4">
                <p className="text-2xl font-bold mb-4">Configurare Linkuri Navbar</p>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-lg font-bold mb-2">Orar (încarcă PDF):</label>
                        <input
                            type="file"
                            accept="application/pdf"
                            disabled={uploading}
                            onChange={(e) => e.target.files && handleFileUpload('orar', e.target.files[0])}
                            className="w-full mt-1 file:bg-white bg-none file:cursor-pointer file:border-gray-300 file:border-2 file:rounded-md file:hover:bg-gray-200 file:shadow-xl file:text-md"
                        />
                        <p className="text-sm text-gray-600 mt-2 break-all">
                            Link curent: {config.orar}
                        </p>
                    </div>

                    <div>
                        <label className="block text-lg font-bold mb-2">Premii (încarcă PDF):</label>
                        <input
                            type="file"
                            accept="application/pdf"
                            disabled={uploading}
                            onChange={(e) => e.target.files && handleFileUpload('premii', e.target.files[0])}
                            className="w-full mt-1 file:bg-white bg-none file:cursor-pointer file:border-gray-300 file:border-2 file:rounded-md file:hover:bg-gray-200 file:shadow-xl file:text-md"
                        />
                        <p className="text-sm text-gray-600 mt-2 break-all">
                            Link curent: {config.premii}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModifyNavbarLinks;

