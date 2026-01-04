"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Trash2, Loader2 } from "lucide-react";

interface Person {
    filename: string;
    url: string;
    pathname: string;
    name: string;
    position: string;
    photo: string;
    order?: number;
}

interface PersonManagerProps {
    folder: string;
    title: string;
    apiEndpoint: string; // e.g., '/api/conducere'
}

const PersonManager = ({ folder, title, apiEndpoint }: PersonManagerProps) => {
    const [persons, setPersons] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formKey, setFormKey] = useState(0);
    
    // Form state
    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchPersons = async () => {
        try {
            setLoading(true);
            const response = await fetch(apiEndpoint);
            const data = await response.json();
            
            // Extract persons from API response
            const personList = data.people.map((item: any) => ({
                filename: item.filename,
                url: item.url,
                pathname: item.pathname,
                ...item.person
            }));
            
            setPersons(personList);
        } catch (error) {
            console.error('Error fetching persons:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPersons();
    }, [apiEndpoint]);

    const resetForm = () => {
        setName('');
        setPosition('');
        setPhotoFile(null);
        setPhotoPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setFormKey(prev => prev + 1);
    };

    const toggleForm = () => {
        if (showAddForm) {
            setShowAddForm(false);
            resetForm();
        } else {
            resetForm();
            setShowAddForm(true);
        }
    };

    const handlePhotoUpload = (file: File) => {
        setPhotoFile(file);
        const reader = new FileReader();
        reader.onload = () => {
            setPhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleAddPerson = async () => {
        if (!name || !position || !photoFile) {
            alert('Name, Position, and Photo are required!');
            return;
        }

        setUploading(true);
        try {
            // First, upload the photo to R2
            const photoFormData = new FormData();
            photoFormData.append('file', photoFile);
            
            const sanitizedName = name.replace(/[^a-zA-Z0-9_\-]/g, '_');
            const photoFilename = `${sanitizedName}_${Date.now()}.${photoFile.name.split('.').pop()}`;
            
            const photoResponse = await fetch(
                `/api/blob/upload?filename=${encodeURIComponent(photoFilename)}&folder=${encodeURIComponent(folder + '/photos')}`,
                {
                    method: 'POST',
                    body: photoFile,
                }
            );

            if (!photoResponse.ok) {
                throw new Error('Failed to upload photo');
            }

            const photoData = await photoResponse.json();
            const photoUrl = photoData.url;

            // Now create the person JSON with the photo URL
            const personData = {
                person: {
                    name: name.trim(),
                    position: position.trim(),
                    photo: photoUrl,
                    order: persons.length
                }
            };

            const fileName = `${sanitizedName}.json`;
            const jsonBlob = new Blob([JSON.stringify(personData, null, 2)], { type: 'application/json' });

            const response = await fetch(
                `/api/blob/upload?filename=${encodeURIComponent(fileName)}&folder=${encodeURIComponent(folder)}`,
                {
                    method: 'POST',
                    body: jsonBlob,
                }
            );

            if (response.ok) {
                alert('Person added successfully!');
                setShowAddForm(false);
                resetForm();
                await fetchPersons();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add person');
            }
        } catch (error) {
            console.error('Error adding person:', error);
            alert(error instanceof Error ? error.message : 'Error adding person!');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (person: Person) => {
        if (!confirm(`Delete ${person.name}?`)) return;

        try {
            // Delete the JSON file
            const response = await fetch(
                `/api/blob/delete?pathname=${encodeURIComponent(person.pathname)}`,
                { method: 'DELETE' }
            );

            if (response.ok) {
                // Also try to delete the photo if it's stored in R2
                if (person.photo.includes('r2.dev')) {
                    const photoPathname = person.photo.split('.dev/')[1];
                    if (photoPathname) {
                        await fetch(
                            `/api/blob/delete?pathname=${encodeURIComponent(photoPathname)}`,
                            { method: 'DELETE' }
                        );
                    }
                }
                await fetchPersons();
            } else {
                alert('Failed to delete person!');
            }
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Error deleting person!');
        }
    };

    const moveUp = async (index: number) => {
        if (index === 0) return;
        
        const newPersons = [...persons];
        [newPersons[index - 1], newPersons[index]] = [newPersons[index], newPersons[index - 1]];
        
        await updateOrders(newPersons);
    };

    const moveDown = async (index: number) => {
        if (index === persons.length - 1) return;
        
        const newPersons = [...persons];
        [newPersons[index], newPersons[index + 1]] = [newPersons[index + 1], newPersons[index]];
        
        await updateOrders(newPersons);
    };

    const updateOrders = async (newPersons: Person[]) => {
        try {
            // Update order for all persons
            const updatePromises = newPersons.map(async (person, idx) => {
                const personData = {
                    person: {
                        name: person.name,
                        position: person.position,
                        photo: person.photo,
                        order: idx
                    }
                };

                // Delete old
                await fetch(`/api/blob/delete?pathname=${encodeURIComponent(person.pathname)}`, { method: 'DELETE' });
                
                // Upload new with updated order
                const jsonBlob = new Blob([JSON.stringify(personData, null, 2)], { type: 'application/json' });
                return fetch(
                    `/api/blob/upload?filename=${encodeURIComponent(person.filename)}&folder=${encodeURIComponent(folder)}`,
                    {
                        method: 'POST',
                        body: jsonBlob,
                    }
                );
            });

            await Promise.all(updatePromises);
            await fetchPersons();
        } catch (error) {
            console.error('Error updating orders:', error);
            alert('Error updating order!');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{title}</h2>
                <Button
                    onClick={toggleForm}
                    className="rounded-md shadow-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                    {showAddForm ? 'Cancel' : 'Add Person'}
                </Button>
            </div>

            {showAddForm && (
                <div key={formKey} className="p-6 border-2 rounded-xl shadow-lg bg-white">
                    <h3 className="text-xl font-bold mb-6">Add New Person</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter full name"
                                className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">Position/Title</label>
                            <input
                                type="text"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                placeholder="Enter position or title"
                                className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">Photo</label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => e.target.files && handlePhotoUpload(e.target.files[0])}
                                className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:cursor-pointer"
                            />
                            {photoPreview && (
                                <img src={photoPreview} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded-lg shadow-md" />
                            )}
                        </div>
                    </div>
                    
                    <Button
                        onClick={handleAddPerson}
                        disabled={uploading}
                        className="mt-6 w-full rounded-lg shadow-md bg-green-600 text-white hover:bg-green-700 font-medium py-3"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin inline" />
                                Adding...
                            </>
                        ) : (
                            'Save Person'
                        )}
                    </Button>
                </div>
            )}

            <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                ) : persons.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No persons added yet</div>
                ) : (
                    persons.map((person, index) => (
                        <div key={person.filename} className="flex items-center gap-4 p-4 border-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                            <img 
                                src={person.photo} 
                                alt={person.name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                            />
                            
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-lg truncate">{person.name}</p>
                                <p className="text-gray-600 text-sm truncate">{person.position}</p>
                            </div>
                            
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => moveUp(index)}
                                    disabled={index === 0}
                                    variant="outline"
                                    size="icon"
                                    title="Move Up"
                                    className="h-9 w-9"
                                >
                                    <ArrowUp className="w-4 h-4" />
                                </Button>
                                
                                <Button
                                    onClick={() => moveDown(index)}
                                    disabled={index === persons.length - 1}
                                    variant="outline"
                                    size="icon"
                                    title="Move Down"
                                    className="h-9 w-9"
                                >
                                    <ArrowDown className="w-4 h-4" />
                                </Button>
                                
                                <Button
                                    onClick={() => handleDelete(person)}
                                    variant="outline"
                                    size="icon"
                                    title="Delete"
                                    className="h-9 w-9 text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PersonManager;
