'use client';

import { useState, useEffect } from 'react';
import uploadNavbarLinksToServer from "@/app/components/uploadnavbarlinkstoserver/uploadnavbarlinkstoserver";

interface NavbarLinksConfig {
    orar: string;
    premii: string;
}

const ModifyNavbarLinks = () => {
    const [config, setConfig] = useState<NavbarLinksConfig>({ orar: '', premii: '' });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await fetch('/assets/uploads/documents/websitedocs/navbar-config.json');
                if (response.ok) {
                    const data = await response.json();
                    setConfig(data);
                } else {
                    setConfig({
                        orar: '/assets/uploads/documents/websitedocs/orar_clase_2024-2025.pdf',
                        premii: '/assets/uploads/documents/websitedocs/rezultate-cns.pdf'
                    });
                }
            } catch (error) {
                console.error('Error loading navbar config:', error);
                setConfig({
                    orar: '/assets/uploads/documents/websitedocs/orar_clase_2024-2025.pdf',
                    premii: '/assets/uploads/documents/websitedocs/rezultate-cns.pdf'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, []);

    const saveConfig = async (nextConfig: NavbarLinksConfig) => {
        const jsonBlob = new Blob([JSON.stringify(nextConfig, null, 2)], {
            type: 'application/json',
        });
        await uploadNavbarLinksToServer('navbar-config.json', jsonBlob);
        setConfig(nextConfig);
    };

    const handleFileUpload = async (field: keyof NavbarLinksConfig, file: File) => {
        try {
            setUploading(true);
            const safeName = file.name.replace(/\s+/g, '_');
            const blob = new Blob([await file.arrayBuffer()], { type: file.type });
            await uploadNavbarLinksToServer(safeName, blob);
            const nextConfig = {
                ...config,
                [field]: `/assets/uploads/documents/websitedocs/${safeName}`,
            };
            await saveConfig(nextConfig);
            alert('Încărcat și salvat cu succes!');
        } catch (error) {
            console.error('Upload failed', error);
            alert('Încărcarea a eșuat.');
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

