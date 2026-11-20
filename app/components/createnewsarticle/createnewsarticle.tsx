'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState } from 'react';
import { ImagePlus, Loader2, Plus, Trash2 } from 'lucide-react';
import { uploadToBlob } from '@/lib/upload-client';

interface ContentItem {
    type: 'paragraph' | 'image';
    text?: string;
    imageUrl?: string;
    caption?: string;
}

const fieldClass =
    'w-full rounded-xl border border-indigo-900/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-indigo-900';

const CreateNews = () => {
    const [title, setTitle] = useState('');
    const [postDate, setPostDate] = useState('');
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [content, setContent] = useState<ContentItem[]>([]);
    const [uploading, setUploading] = useState(false);
    const thumbRef = useRef<HTMLInputElement>(null);

    const handleThumbnailChange = (file: File | null) => {
        if (!file) return;
        setThumbnailFile(file);
        const reader = new FileReader();
        reader.onload = () => setThumbnailPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const addContentItem = (type: 'paragraph' | 'image') => {
        setContent((prev) =>
            type === 'paragraph'
                ? [...prev, { type, text: '' }]
                : [...prev, { type, imageUrl: '', caption: '' }]
        );
    };

    const handleContentImageUpload = async (index: number, file: File) => {
        try {
            const result = await uploadToBlob(file, file.name, 'news/images');
            setContent((prev) =>
                prev.map((item, i) => (i === index ? { ...item, imageUrl: result.url } : item))
            );
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to upload image');
        }
    };

    const handlePublish = async () => {
        if (!title || !postDate || !thumbnailFile) {
            alert('Titlu, data și thumbnail-ul sunt obligatorii!');
            return;
        }

        setUploading(true);
        try {
            const thumbnailResult = await uploadToBlob(
                thumbnailFile,
                thumbnailFile.name,
                'news/thumbnails'
            );

            const article = {
                article: {
                    title,
                    post_date: postDate,
                    thumbnail: thumbnailResult.url,
                    content: content.map((item) => ({
                        type: item.type,
                        text: item.text,
                        imageUrl: item.imageUrl,
                        caption: item.caption,
                    })),
                },
            };

            const sanitizedTitle = title.replace(/[^a-zA-Z0-9_\-]/g, '_');
            const jsonBlob = new Blob([JSON.stringify(article, null, 2)], { type: 'application/json' });
            await uploadToBlob(jsonBlob, `${sanitizedTitle}.json`, 'news', {
                contentType: 'application/json',
            });

            alert('Anunț publicat cu succes!');
            setTitle('');
            setPostDate('');
            setThumbnailFile(null);
            setThumbnailPreview(null);
            setContent([]);
            if (thumbRef.current) thumbRef.current.value = '';
            window.dispatchEvent(new CustomEvent('dashboard-news-changed'));
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to publish article');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-5">
                <div className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-bold text-indigo-900">Titlu</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Titlul anunțului"
                            className={fieldClass}
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-bold text-indigo-900">Data</label>
                        <input
                            type="date"
                            value={postDate}
                            onChange={(e) => setPostDate(e.target.value)}
                            className={fieldClass}
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-bold text-indigo-900">Thumbnail</label>
                    <button
                        type="button"
                        onClick={() => thumbRef.current?.click()}
                        className="flex w-full min-h-[160px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-indigo-900/25 bg-indigo-50/40 px-4 py-5 text-center hover:bg-indigo-50"
                    >
                        {thumbnailPreview ? (
                            <img
                                src={thumbnailPreview}
                                alt="Thumbnail"
                                className="h-36 w-full rounded-lg object-cover"
                            />
                        ) : (
                            <>
                                <ImagePlus className="h-7 w-7 text-indigo-900" />
                                <span className="text-sm font-bold text-indigo-900">Alege imaginea principală</span>
                            </>
                        )}
                    </button>
                    <input
                        ref={thumbRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleThumbnailChange(e.target.files?.[0] || null)}
                    />
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-bold text-indigo-900">Conținut</p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => addContentItem('paragraph')}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-900/15 bg-white px-3 py-1.5 text-xs font-bold text-indigo-900 hover:bg-indigo-50"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Paragraf
                        </button>
                        <button
                            type="button"
                            onClick={() => addContentItem('image')}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-900/15 bg-white px-3 py-1.5 text-xs font-bold text-indigo-900 hover:bg-indigo-50"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Imagine
                        </button>
                    </div>
                </div>

                {content.length === 0 && (
                    <p className="rounded-xl border border-dashed border-indigo-900/15 bg-indigo-50/30 px-4 py-6 text-center text-sm text-gray-500">
                        Adaugă paragrafe sau imagini pentru corpul anunțului.
                    </p>
                )}

                {content.map((item, index) => (
                    <div
                        key={index}
                        className="rounded-xl border border-indigo-900/10 bg-white p-4"
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-wide text-indigo-900/60">
                                {item.type === 'paragraph' ? 'Paragraf' : 'Imagine'}
                            </p>
                            <button
                                type="button"
                                onClick={() => setContent((prev) => prev.filter((_, i) => i !== index))}
                                className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>

                        {item.type === 'paragraph' ? (
                            <textarea
                                value={item.text || ''}
                                onChange={(e) =>
                                    setContent((prev) =>
                                        prev.map((entry, i) =>
                                            i === index ? { ...entry, text: e.target.value } : entry
                                        )
                                    )
                                }
                                placeholder="Textul paragrafului..."
                                className={`${fieldClass} min-h-[120px] resize-y`}
                            />
                        ) : (
                            <div className="space-y-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleContentImageUpload(index, file);
                                    }}
                                    className="w-full text-sm"
                                />
                                {item.imageUrl && (
                                    <img
                                        src={item.imageUrl}
                                        alt={`Content ${index}`}
                                        className="h-40 w-full rounded-lg object-cover"
                                    />
                                )}
                                <input
                                    type="text"
                                    value={item.caption || ''}
                                    onChange={(e) =>
                                        setContent((prev) =>
                                            prev.map((entry, i) =>
                                                i === index ? { ...entry, caption: e.target.value } : entry
                                            )
                                        )
                                    }
                                    placeholder="Descriere imagine (opțional)"
                                    className={fieldClass}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handlePublish}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-950 disabled:opacity-50"
                >
                    {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {uploading ? 'Se publică...' : 'Publică anunț'}
                </button>
            </div>
        </div>
    );
};

export default CreateNews;
