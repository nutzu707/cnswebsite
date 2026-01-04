'use client';

/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';

const CreateProjectJsonFile = () => {
    const [title, setTitle] = useState('');
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [link, setLink] = useState('');
    const [color, setColor] = useState('#4F46E5'); // Default indigo
    const [uploading, setUploading] = useState(false);

    const handlePhotoChange = (file: File | null) => {
        if (!file) return;
        
        setPhotoFile(file);
        const reader = new FileReader();
        reader.onload = () => {
            setPhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value.slice(0, 50);
        setTitle(newTitle);
    };

    const handlePublish = async () => {
        if (!title || !photoFile) {
            alert('Titlu și Fotografie sunt obligatorii!');
            return;
        }

        setUploading(true);
        try {
            // Step 1: Upload photo to R2
            const photoResponse = await fetch(
                `/api/blob/upload?filename=${encodeURIComponent(photoFile.name)}&folder=projects/photos`,
                {
                    method: 'POST',
                    body: photoFile,
                }
            );

            if (!photoResponse.ok) {
                throw new Error('Failed to upload photo');
            }

            const photoResult = await photoResponse.json();

            // Step 2: Create project JSON with R2 URL
            const project = {
                project: {
                    title,
                    photo: photoResult.url, // R2 URL, not base64!
                    link,
                    color,
                },
            };

            // Step 3: Upload JSON to R2
            const sanitizedTitle = title.replace(/[^a-zA-Z0-9_\-]/g, '_');
            const fileName = `${sanitizedTitle}.json`;

            const jsonBlob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });

            const jsonResponse = await fetch(
                `/api/blob/upload?filename=${encodeURIComponent(fileName)}&folder=projects`,
                {
                    method: 'POST',
                    body: jsonBlob,
                }
            );

            if (jsonResponse.ok) {
                alert('Proiect creat cu succes!');
                // Reset form
                setTitle('');
                setPhotoFile(null);
                setPhotoPreview(null);
                setLink('');
                setColor('#4F46E5');
            } else {
                const errorData = await jsonResponse.json();
                alert(errorData.error || 'Eroare la crearea proiectului!');
            }
        } catch (error) {
            console.error('Error creating project:', error);
            const errorMessage = error instanceof Error ? error.message : 'Eroare la crearea proiectului!';
            alert(errorMessage);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="rounded-md shadow-2xl border-2 p-4">
                {/* Title */}
                <div className="items-center flex flex-col mt-4">
                    <label className="text-xl font-bold mb-2">Titlu Proiect</label>
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Nume proiect (max 50 caractere)"
                        className="border-2 p-2 shadow-2xl rounded-md text-center w-[90%]"
                        maxLength={50}
                    />
                    <p className="text-xs text-gray-500 mt-1">{title.length}/50 caractere</p>
                </div>

                {/* Photo */}
                <div className="items-center flex flex-col mt-4">
                    <label className="text-xl font-bold mb-2">Fotografie Proiect</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePhotoChange(file);
                        }}
                        className="w-[300px] mt-1 file:bg-white bg-none file:cursor-pointer file:border-gray-300 file:clear-start file:border-2 file:rounded-md file:hover:bg-gray-200 file:shadow-xl file:text-xl"
                    />
                    {photoPreview && (
                        <div className="mt-4">
                            <img
                                src={photoPreview}
                                alt="Photo Preview"
                                className="rounded-xl shadow-2xl w-[300px] h-[200px] object-cover"
                            />
                        </div>
                    )}
                </div>

                {/* Link */}
                <div className="items-center flex flex-col mt-4">
                    <label className="text-xl font-bold mb-2">Link (Opțional)</label>
                    <input
                        type="text"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="https://exemplu.com (opțional)"
                        className="border-2 p-2 shadow-2xl rounded-md text-center w-[90%]"
                    />
                </div>

                {/* Color */}
                <div className="items-center flex flex-col mt-4">
                    <label className="text-xl font-bold mb-2">Culoare Accent</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-20 h-12 rounded-md cursor-pointer border-2"
                        />
                        <span className="text-sm text-gray-600">{color}</span>
                    </div>
                </div>

                {/* Publish Button */}
                <button
                    onClick={handlePublish}
                    disabled={uploading}
                    className="text-xl rounded-lg shadow-xl bg-green-600 text-white border-2 border-solid hover:bg-green-700 font-bold mt-8 p-3 mb-8 mx-auto block px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {uploading ? 'Se creează...' : 'Creează Proiect'}
                </button>
            </div>
        </div>
    );
};

export default CreateProjectJsonFile;
