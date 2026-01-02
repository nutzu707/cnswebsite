"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";

interface Person {
    filename: string;
    url: string;
    name: string;
    position: string;
    photo: string;
    order?: number;
}

interface PersonManagerProps {
    folder: string;
    title: string;
}

const PersonManager = ({ folder, title }: PersonManagerProps) => {
    const [persons, setPersons] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formKey, setFormKey] = useState(0);
    
    // Form state
    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [photo, setPhoto] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchPersons = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/blob/list?folder=${encodeURIComponent(folder)}`);
            const data = await response.json();
            
            // Parse each person file
            const personPromises = (data.files || []).map(async (file: any) => {
                try {
                    const res = await fetch(file.url);
                    const json = await res.json();
                    return {
                        filename: file.filename,
                        url: file.url,
                        pathname: file.pathname,
                        ...json.person
                    };
                } catch (error) {
                    console.error(`Error parsing ${file.filename}:`, error);
                    return null;
                }
            });
            
            const allPersons = (await Promise.all(personPromises)).filter(p => p !== null);
            
            // Sort by order, then by name
            allPersons.sort((a, b) => {
                const aOrder = a.order ?? 999;
                const bOrder = b.order ?? 999;
                if (aOrder !== bOrder) return aOrder - bOrder;
                return a.name.localeCompare(b.name);
            });
            
            setPersons(allPersons);
        } catch (error) {
            console.error('Error fetching persons:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPersons();
    }, [folder]);

    const resetForm = () => {
        setShowAddForm(false);
        // Use setTimeout to ensure form is fully unmounted before clearing state
        setTimeout(() => {
            setName('');
            setPosition('');
            setPhoto(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setFormKey(prev => prev + 1);
        }, 0);
    };

    const toggleForm = () => {
        if (showAddForm) {
            // Closing the form - reset everything
            setShowAddForm(false);
            setTimeout(() => {
                setName('');
                setPosition('');
                setPhoto(null);
                setFormKey(prev => prev + 1);
            }, 0);
        } else {
            // Opening the form - ensure clean state
            setName('');
            setPosition('');
            setPhoto(null);
            setFormKey(prev => prev + 1);
            // Small delay to ensure state is cleared before showing form
            setTimeout(() => {
                setShowAddForm(true);
            }, 10);
        }
    };

    const handlePhotoUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            setPhoto(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleAddPerson = async () => {
        if (!name || !position || !photo) {
            alert('Name, Position, and Photo are required!');
            return;
        }

        setUploading(true);
        try {
            const personData = {
                person: {
                    name: name.trim(),
                    position: position.trim(),
                    photo,
                    order: persons.length
                }
            };

            const sanitizedName = name.replace(/[^a-zA-Z0-9_\-]/g, '_');
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
                resetForm();
                await fetchPersons();
            } else {
                let errorMessage = 'Failed to add person!';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch {
                    errorMessage = `Failed: ${response.status}`;
                }
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Error adding person:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error adding person!';
            alert(errorMessage);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (person: Person) => {
        if (!confirm(`Delete ${person.name}?`)) return;

        try {
            const response = await fetch(
                `/api/blob/delete?url=${encodeURIComponent(person.url)}`,
                { method: 'DELETE' }
            );

            if (response.ok) {
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
                await fetch(`/api/blob/delete?url=${encodeURIComponent(person.url)}`, { method: 'DELETE' });
                
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
        <div>
            <div className="mb-4">
                <Button
                    onClick={toggleForm}
                    className="text-xl rounded-md shadow-xl bg-indigo-900 text-white hover:bg-indigo-950 font-bold"
                >
                    {showAddForm ? 'Cancel' : 'Add Person'}
                </Button>
            </div>

            {showAddForm && (
                <div key={formKey} className="mb-8 p-6 border-2 rounded-2xl shadow-2xl bg-gray-50">
                    <h3 className="text-2xl font-bold mb-4">Add New Person</h3>
                    
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full p-2 mb-4 border-2 rounded-md"
                    />
                    
                    <input
                        type="text"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        placeholder="Position/Title"
                        className="w-full p-2 mb-4 border-2 rounded-md"
                    />
                    
                    <div className="mb-4">
                        <label className="block mb-2 font-bold">Photo</label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files && handlePhotoUpload(e.target.files[0])}
                            className="w-full file:bg-white file:cursor-pointer file:border-gray-300 file:border-2 file:rounded-md file:hover:bg-gray-200 file:shadow-xl file:p-2"
                        />
                        {photo && (
                            <img src={photo} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded-full" />
                        )}
                    </div>
                    
                    <Button
                        onClick={handleAddPerson}
                        disabled={uploading}
                        className="text-xl rounded-md shadow-xl bg-green-600 text-white hover:bg-green-700 font-bold"
                    >
                        {uploading ? 'Adding...' : 'Save Person'}
                    </Button>
                </div>
            )}

            <div className="h-[400px] overflow-y-scroll pr-2">
                {loading ? (
                    <div className="text-xl">Loading...</div>
                ) : persons.length === 0 ? (
                    <div className="text-xl text-gray-500">No persons added yet</div>
                ) : (
                    <div className="space-y-4">
                        {persons.map((person, index) => (
                            <div key={person.filename} className="flex items-center gap-4 p-4 border-2 rounded-lg bg-white shadow-md">
                                <img 
                                    src={person.photo} 
                                    alt={person.name}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                
                                <div className="flex-1">
                                    <p className="font-bold text-lg">{person.name}</p>
                                    <p className="text-gray-600">{person.position}</p>
                                </div>
                                
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => moveUp(index)}
                                        disabled={index === 0}
                                        className="p-2"
                                        title="Move Up"
                                    >
                                        <ArrowUp className="w-5 h-5" />
                                    </Button>
                                    
                                    <Button
                                        onClick={() => moveDown(index)}
                                        disabled={index === persons.length - 1}
                                        className="p-2"
                                        title="Move Down"
                                    >
                                        <ArrowDown className="w-5 h-5" />
                                    </Button>
                                    
                                    <Button
                                        onClick={() => handleDelete(person)}
                                        className="p-2 bg-red-600 hover:bg-red-700"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PersonManager;

