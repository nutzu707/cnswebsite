'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';

interface ContentItem {
    type: 'paragraph' | 'image';
    text?: string;
    imageUrl?: string;
    caption?: string;
}

const CreateNews = () => {
    const [title, setTitle] = useState('');
    const [postDate, setPostDate] = useState('');
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [content, setContent] = useState<ContentItem[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleThumbnailChange = (file: File) => {
        setThumbnailFile(file);
        const reader = new FileReader();
        reader.onload = () => {
            setThumbnailPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const addContentItem = (type: 'paragraph' | 'image') => {
        if (type === 'paragraph') {
            setContent([...content, { type, text: '' }]);
        } else if (type === 'image') {
            setContent([...content, { type, imageUrl: '', caption: '' }]);
        }
    };

    const updateContentText = (index: number, text: string) => {
        const updatedContent = [...content];
        updatedContent[index] = { ...updatedContent[index], text };
        setContent(updatedContent);
    };

    const updateContentCaption = (index: number, caption: string) => {
        const updatedContent = [...content];
        updatedContent[index] = { ...updatedContent[index], caption };
        setContent(updatedContent);
    };

    const handleContentImageUpload = async (index: number, file: File) => {
        try {
            // Upload image to R2
            const response = await fetch(
                `/api/blob/upload?filename=${encodeURIComponent(file.name)}&folder=news/images`,
                {
                    method: 'POST',
                    body: file,
                }
            );

            if (response.ok) {
                const result = await response.json();
                const updatedContent = [...content];
                updatedContent[index] = { ...updatedContent[index], imageUrl: result.url };
                setContent(updatedContent);
            } else {
                alert('Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        }
    };

    const deleteContentItem = (index: number) => {
        const updatedContent = content.filter((_, i) => i !== index);
        setContent(updatedContent);
    };

    const handlePublish = async () => {
        if (!title || !postDate || !thumbnailFile) {
            alert('Title, Date, and Thumbnail are mandatory!');
            return;
        }

        setUploading(true);
        try {
            // Step 1: Upload thumbnail to R2
            const thumbnailResponse = await fetch(
                `/api/blob/upload?filename=${encodeURIComponent(thumbnailFile.name)}&folder=news/thumbnails`,
                {
                    method: 'POST',
                    body: thumbnailFile,
                }
            );

            if (!thumbnailResponse.ok) {
                throw new Error('Failed to upload thumbnail');
            }

            const thumbnailResult = await thumbnailResponse.json();

            // Step 2: Create article JSON with R2 URLs
            const article = {
                article: {
                    title,
                    post_date: postDate,
                    thumbnail: thumbnailResult.url, // R2 URL, not base64!
                    content: content.map(item => ({
                        type: item.type,
                        text: item.text,
                        imageUrl: item.imageUrl, // R2 URL, not base64!
                        caption: item.caption,
                    })),
                },
            };

            // Step 3: Upload JSON to R2
            const sanitizedTitle = title.replace(/[^a-zA-Z0-9_\-]/g, '_');
            const fileName = `${sanitizedTitle}.json`;

            const jsonBlob = new Blob([JSON.stringify(article, null, 2)], { type: 'application/json' });

            const jsonResponse = await fetch(
                `/api/blob/upload?filename=${encodeURIComponent(fileName)}&folder=news`,
                {
                    method: 'POST',
                    body: jsonBlob,
                }
            );

            if (jsonResponse.ok) {
                alert('Anunț publicat cu succes!');
                // Reset form
                setTitle('');
                setPostDate('');
                setThumbnailFile(null);
                setThumbnailPreview(null);
                setContent([]);
            } else {
                const errorData = await jsonResponse.json();
                alert(errorData.error || 'Failed to publish article');
            }
        } catch (error) {
            console.error('Error publishing article:', error);
            alert('Failed to publish article');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="rounded-md shadow-2xl border-2 p-4">
                {/* Title */}
                <div className="items-center flex flex-col mt-4">
                    <label className="text-xl font-bold mb-2">Titlu Anunț</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Titlu"
                        className="border-2 p-2 shadow-2xl rounded-md text-center w-[90%]"
                    />
                </div>

                {/* Date */}
                <div className="items-center flex flex-col mt-4">
                    <label className="text-xl font-bold mb-2">Data</label>
                    <input
                        type="date"
                        value={postDate}
                        className="border-2 p-2 shadow-2xl rounded-md text-center w-[90%]"
                        onChange={(e) => setPostDate(e.target.value)}
                    />
                </div>

                {/* Thumbnail */}
                <div className="items-center flex flex-col mt-4 mb-8">
                    <label className="text-xl font-bold mb-2">Thumbnail (Imagine Principală)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files && handleThumbnailChange(e.target.files[0])}
                        className="w-[300px] mt-1 file:bg-white bg-none file:cursor-pointer file:border-gray-300 file:clear-start file:border-2 file:rounded-md file:hover:bg-gray-200 file:shadow-xl file:text-xl"
                    />
                    {thumbnailPreview && (
                        <div className="mt-4">
                            <img
                                src={thumbnailPreview}
                                alt="Thumbnail Preview"
                                className="rounded-xl shadow-2xl w-[300px] h-[165px] object-cover"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Content Items */}
            <div className="items-center flex flex-col mt-4">
                {content.map((item, index) => (
                    <div key={index} className="w-full mb-4">
                        {item.type === 'paragraph' && (
                            <div>
                                <label className="text-lg font-bold mb-2 block">Paragraf</label>
                                <textarea
                                    value={item.text || ''}
                                    onChange={(e) => updateContentText(index, e.target.value)}
                                    placeholder="Text paragraf..."
                                    className="resize-none border-2 rounded-md focus:outline-0 focus:border-4 focus:border-blue-900 shadow-2xl w-full h-[200px] p-2"
                                />
                            </div>
                        )}
                        {item.type === 'image' && (
                            <div className="items-center flex flex-col border-2 shadow-2xl rounded-md p-4">
                                <label className="text-lg font-bold mb-2">Imagine</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        e.target.files && handleContentImageUpload(index, e.target.files[0])
                                    }
                                    className="w-[300px] mt-1 file:bg-white bg-none file:cursor-pointer file:border-gray-300 file:clear-start file:border-2 file:rounded-md file:hover:bg-gray-200 file:shadow-xl file:text-xl"
                                />
                                {item.imageUrl && (
                                    <div className="mt-4">
                                        <img
                                            src={item.imageUrl}
                                            alt={`Preview ${index}`}
                                            className="rounded-xl shadow-2xl w-[300px] h-[165px] object-cover"
                                        />
                                    </div>
                                )}
                                <label className="text-md font-bold mt-4 mb-2">Descriere</label>
                                <input
                                    type="text"
                                    value={item.caption || ''}
                                    onChange={(e) => updateContentCaption(index, e.target.value)}
                                    placeholder="Descriere imagine..."
                                    className="border-2 p-2 shadow-2xl rounded-md text-center w-full"
                                />
                            </div>
                        )}
                        <button
                            className="text-xl rounded-md shadow-xl bg-white text-black border-2 border-solid hover:bg-red-200 font-bold p-2 mt-2 mx-auto block"
                            onClick={() => deleteContentItem(index)}
                        >
                            Șterge
                        </button>
                    </div>
                ))}

                {/* Add Content Buttons */}
                <div className="flex gap-4 mt-4">
                    <button
                        className="text-xl rounded-md shadow-xl bg-white text-black border-2 border-solid hover:bg-gray-200 font-bold p-2 px-4"
                        onClick={() => addContentItem('paragraph')}
                    >
                        Adaugă Paragraf
                    </button>
                    <button
                        className="text-xl rounded-md shadow-xl bg-white text-black border-2 border-solid hover:bg-gray-200 font-bold p-2 px-4"
                        onClick={() => addContentItem('image')}
                    >
                        Adaugă Imagine
                    </button>
                </div>
            </div>

            {/* Publish Button */}
            <button
                onClick={handlePublish}
                disabled={uploading}
                className="text-xl rounded-md shadow-xl bg-green-600 text-white border-2 border-solid hover:bg-green-700 font-bold mt-8 p-3 mb-16 mx-auto block px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {uploading ? 'Se publică...' : 'Publică Anunț'}
            </button>
        </div>
    );
};

export default CreateNews;
