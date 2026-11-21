'use client';

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { uploadToBlob } from '@/lib/upload-client';

const CreateProjectJsonFile = () => {
    const [title, setTitle] = useState('');
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [link, setLink] = useState('');
    const [color, setColor] = useState('#2E3171');
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const handlePhotoChange = (file: File | null) => {
        if (!file) return;
        setPhotoFile(file);
        const reader = new FileReader();
        reader.onload = () => setPhotoPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handlePublish = async () => {
        if (!title || !photoFile) {
            alert('Titlu și fotografia sunt obligatorii!');
            return;
        }

        setUploading(true);
        try {
            const photoResult = await uploadToBlob(photoFile, photoFile.name, 'projects/photos');
            const project = {
                project: { title, photo: photoResult.url, link, color },
            };
            const sanitizedTitle = title.replace(/[^a-zA-Z0-9_\-]/g, '_');
            const jsonBlob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
            await uploadToBlob(jsonBlob, `${sanitizedTitle}.json`, 'projects', {
                contentType: 'application/json',
            });

            alert('Proiect creat cu succes!');
            setTitle('');
            setPhotoFile(null);
            setPhotoPreview(null);
            setLink('');
            setColor('#2E3171');
            if (fileRef.current) fileRef.current.value = '';
            window.dispatchEvent(new CustomEvent('dashboard-projects-changed'));
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Eroare la crearea proiectului!');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <div className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-bold text-indigo-900">Titlu</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value.slice(0, 50))}
                            placeholder="Numele proiectului"
                            maxLength={50}
                            className="w-full rounded-xl border border-indigo-900/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-indigo-900"
                        />
                        <p className="mt-1 text-xs text-gray-500">{title.length}/50</p>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-bold text-indigo-900">Link (opțional)</label>
                        <input
                            type="url"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            placeholder="https://..."
                            className="w-full rounded-xl border border-indigo-900/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-indigo-900"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-bold text-indigo-900">Culoare accent</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="h-10 w-14 cursor-pointer rounded-lg border border-indigo-900/15 bg-white p-1"
                            />
                            <span className="text-sm text-gray-600 font-mono">{color}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-bold text-indigo-900">Fotografie</label>
                    <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="flex w-full min-h-[180px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-indigo-900/25 bg-indigo-50/40 px-4 py-6 text-center hover:bg-indigo-50"
                    >
                        {photoPreview ? (
                            <img
                                src={photoPreview}
                                alt="Preview"
                                className="h-40 w-full rounded-lg object-cover"
                            />
                        ) : (
                            <>
                                <ImagePlus className="h-7 w-7 text-indigo-900" />
                                <span className="text-sm font-bold text-indigo-900">Alege o imagine</span>
                                <span className="text-xs text-gray-500">JPG, PNG</span>
                            </>
                        )}
                    </button>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoChange(e.target.files?.[0] || null)}
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handlePublish}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-950 disabled:opacity-50"
                >
                    {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {uploading ? 'Se creează...' : 'Creează proiect'}
                </button>
            </div>
        </div>
    );
};

export default CreateProjectJsonFile;
