'use client';

/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { upload } from '@vercel/blob/client';

const CreateProjectJsonFile = () => {
    const [title, setTitle] = useState('');
    const [postDate, setPostDate] = useState('');
    const [photo, setPhoto] = useState<string | null>(null); // New state for photo (thumbnail)
    const [link, setLink] = useState('');
    const [color, setColor] = useState('#000000');
    const [uploading, setUploading] = useState(false);
    const [content, setContent] = useState<
        { type: 'paragraph' | 'image'; text?: string; imageData?: string; caption?: string }[]
    >([]);

    const handleThumbnailUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            setPhoto(reader.result as string);
        };
        reader.readAsDataURL(file);
    };
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value.slice(0, 30);
        setTitle(newTitle);
    };
    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setColor(e.target.value);
    };



    const generateJson = async () => {
        if (!title  || !photo) {
            alert('Title and Photo are mandatory!');
            return;
        }

        const jsonObject = {
            project: {
                title,
                photo,
                link,
                color,
            },
        };

        const sanitizedTitle = title.replace(/[^a-zA-Z0-9_\-]/g, '_');
        const fileName = `${sanitizedTitle || 'untitled'}.json`;

        setUploading(true);
        try {
            // Check if file already exists
            const listResponse = await fetch(`/api/blob/list?folder=projects`);
            const listData = await listResponse.json();
            const existingFile = listData.files?.find((f: any) => f.filename === fileName);
            
            if (existingFile) {
                alert(`Proiect cu titlul "${title}" există deja. Vă rugăm să folosiți un titlu diferit.`);
                return;
            }

            // Upload to blob storage using client-side upload
            const jsonString = JSON.stringify(jsonObject, null, 2);
            const jsonBlob = new Blob([jsonString], { type: 'application/json' });
            
            const blob = await upload(`projects/${fileName}`, jsonBlob, {
                access: 'public',
                handleUploadUrl: '/api/blob/upload-token',
            });

            console.log('Upload successful:', blob.url);
            alert('Proiect creat cu succes!');
            // Reset form
            setTitle('');
            setPhoto(null);
            setLink('');
            setColor('#000000');
        } catch (error: any) {
            console.error('Error uploading project:', error);
            const errorMessage = error?.message || 'Eroare la crearea proiectului!';
            alert(errorMessage);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full ">
            <div className="rounded-md shadow-2xl border-2">
            <div className="items-center flex flex-col mt-16">
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Titlu"
                    className="border-2 p-1 shadow-2xl rounded-md text-center w-[90%]"
                />
            </div>

            <div className="items-center flex flex-col mt-4">
                <label>Thumbnail</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && handleThumbnailUpload(e.target.files[0])}
                    className="w-[300px] mt-1 file:bg-white bg-none file:cursor-pointer file:border-gray-300 file:clear-start file:border-2  file:rounded-md file:hover:bg-gray-200 file:shadow-xl file:text-xl  "
                />
                {photo && (
                    <div>
                        <img
                            src={photo}
                            alt="Thumbnail Preview"
                            className="rounded-xl shadow-2xl mt-4 w-[300px] object-cover"
                        />
                    </div>
                )}
            </div>
            <div className="items-center flex flex-col mt-4">
                <input
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Link la proiect"
                    className="border-2 p-1 shadow-2xl rounded-md text-center my-2 w-[90%]"
                />
            </div>
                <div className="items-center flex flex-col mt-4">
                <label>Culoare</label>
                <input
                    type="color"
                    value={color}
                    onChange={handleColorChange}
                    placeholder="Pick a color"
                    className="w-20"
                />
            </div>


            <button 
                onClick={generateJson} 
                disabled={uploading}
                className="text-xl rounded-md shadow-xl bg-white text-black border-2 border-solid hover:bg-gray-200 font-bold mt-8 p-1 mb-16  mx-auto block px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {uploading ? 'Se încarcă...' : 'Creeaza proiect'}
            </button>
            </div>
        </div>
    );
};

export default CreateProjectJsonFile;
