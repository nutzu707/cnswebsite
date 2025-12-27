'use client';

import React, { useState } from 'react';
import uploadnewstoserver from "@/app/components/uploadnewstoserver/uploadnewstoserver";

const CreateNews = () => {
    const [title, setTitle] = useState('');
    const [postDate, setPostDate] = useState('');
    const [thumbnail, setThumbnail] = useState<string | null>(null); // New state for thumbnail
    const [content, setContent] = useState<
        { type: 'paragraph' | 'image'; text?: string; imageData?: string; caption?: string }[]
    >([]);

    const handleThumbnailUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            setThumbnail(reader.result as string); // Set the thumbnail image as Base64
        };
        reader.readAsDataURL(file);
    };

    const addContentItem = (type: 'paragraph' | 'image') => {
        if (type === 'paragraph') {
            setContent([...content, { type, text: '' }]);
        } else if (type === 'image') {
            setContent([...content, { type, imageData: '', caption: '' }]);
        }
    };

    const updateContentItem = (index: number, key: string, value: string) => {
        const updatedContent = [...content];
        updatedContent[index] = { ...updatedContent[index], [key]: value };
        setContent(updatedContent);
    };

    const handleFileUpload = (index: number, file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64Image = reader.result as string;
            const updatedContent = [...content];
            updatedContent[index] = { ...updatedContent[index], imageData: base64Image };
            setContent(updatedContent);
        };
        reader.readAsDataURL(file);
    };

    const deleteContentItem = (index: number) => {
        const updatedContent = content.filter((_, i) => i !== index);
        setContent(updatedContent);
    };



    const generateJson = () => {
        if (!title || !postDate || !thumbnail) {
            alert('Title, Date, and Thumbnail are mandatory!');
            return;
        }

        const jsonObject = {
            article: {
                title,
                post_date: postDate,
                thumbnail,
                content,
            },
        };
        const jsonBlob = new Blob([JSON.stringify(jsonObject, null, 2)], {
            type: 'application/json',
        });

        const sanitizedTitle = title.replace(/[^a-zA-Z0-9_\-]/g, '_');
        const fileName = `${sanitizedTitle || 'untitled'}.json`;

        const url = URL.createObjectURL(jsonBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;

        uploadnewstoserver(fileName, jsonBlob);

    };



    return (
        <div className="w-full ">
            <div className="rounded-md shadow-2xl border-2">
            <div className="items-center flex flex-col mt-16">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Titlu"
                    className="border-2 p-1 shadow-2xl rounded-md text-center w-[90%] "
                />
            </div>
            <div className="items-center flex flex-col mt-4">
                <input
                    type="date"
                    value={postDate}
                    className="border-2 p-1 shadow-2xl rounded-md text-center w-[90%]"
                    onChange={(e) => setPostDate(e.target.value)}
                />
            </div>
            <div className="items-center flex flex-col mt-4 mb-8">
                <label>Thumbnail</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && handleThumbnailUpload(e.target.files[0])}
                    className="w-[300px] mt-1 file:bg-white bg-none file:cursor-pointer file:border-gray-300 file:clear-start file:border-2  file:rounded-md file:hover:bg-gray-200 file:shadow-xl file:text-xl  "
                />

                {thumbnail && (
                    <div>
                        <img
                            src={thumbnail}
                            alt="Thumbnail Preview"
                            className="rounded-xl shadow-2xl mt-4 w-[300px] h-[165px] object-cover"
                        />
                    </div>
                )}
            </div>
            </div>
            <div className="items-center flex flex-col mt-4">
                {content.map((item, index) => (
                    <div key={index} className="w-full">
                        {item.type === 'paragraph' && (
                            <textarea
                                value={item.text || ''}
                                onChange={(e) =>
                                    updateContentItem(index, 'text', e.target.value)
                                }
                                placeholder="Text Paragraf "
                                className="resize-none border-2 rounded-md focus:outline-0 focus:border-4 focus:border-blue-900 shadow-2xl w-full h-[200px] p-2 "
                            />
                        )}
                        {item.type === 'image' && (
                            <div className="items-center flex flex-col border-2 shadow-2xl rounded-md">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        e.target.files && handleFileUpload(index, e.target.files[0])
                                    }
                                    className="w-[300px] mt-1 file:bg-white bg-none file:cursor-pointer file:border-gray-300 file:clear-start file:border-2  file:rounded-md file:hover:bg-gray-200 file:shadow-xl file:text-xl "

                                />
                                {item.imageData && (
                                    <div>
                                        <img
                                            src={item.imageData}
                                            alt={`Preview ${index}`}
                                            className="rounded-xl shadow-2xl mt-4 w-[300px] h-[165px] object-cover"

                                        />
                                    </div>
                                )}
                                <input
                                    type="text"
                                    value={item.caption || ''}
                                    onChange={(e) =>
                                        updateContentItem(index, 'caption', e.target.value)
                                    }
                                    placeholder="Descriere Imagine "
                                    className="border-2 p-1 shadow-2xl rounded-md text-center my-2"

                                />
                            </div>
                        )}
                        <button className="text-xl rounded-md shadow-xl bg-white text-black border-2 border-solid hover:bg-gray-200 font-bold p-1 mb-8 mx-auto block mt-2" onClick={() => deleteContentItem(index)}>Sterge</button>
                    </div>
                ))}
                <div className="flex mt-4">
                    <button className="text-xl rounded-md shadow-xl bg-white text-black border-2 border-solid hover:bg-gray-200 font-bold p-1 mr-2 px-4" onClick={() => addContentItem('paragraph')}>Adauga paragraf</button>
                    <button className="text-xl rounded-md shadow-xl bg-white text-black border-2 border-solid hover:bg-gray-200 font-bold p-1 px-4" onClick={() => addContentItem('image')}>Adauga imagine</button>

                </div>
                 </div>
            <button onClick={generateJson} className="text-xl rounded-md shadow-xl bg-white text-black border-2 border-solid hover:bg-gray-200 font-bold mt-8 p-1 mb-16  mx-auto block px-4">
                Posteaza anunt
            </button>
        </div>
    );
};

export default CreateNews;
