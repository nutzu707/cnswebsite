"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";

interface Profesor {
    filename: string;
    url: string;
    nume: string;
    order?: number;
}

const ConsiliuProfesoralManager = () => {
    const [profesori, setProfesori] = useState<Profesor[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formKey, setFormKey] = useState(0);
    
    const [nume, setNume] = useState("");
    const [uploading, setUploading] = useState(false);
    const inputRefNume = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setShowAddForm(false);
        setTimeout(() => {
            setNume('');
            if (inputRefNume.current) inputRefNume.current.value = '';
            setFormKey(prev => prev + 1);
        }, 0);
    };

    const toggleForm = () => {
        if (showAddForm) {
            setShowAddForm(false);
            setTimeout(() => {
                setNume('');
                setFormKey(prev => prev + 1);
            }, 0);
        } else {
            setNume('');
            setFormKey(prev => prev + 1);
            setTimeout(() => {
                setShowAddForm(true);
            }, 10);
        }
    };

    const fetchProfesori = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/blob/list?folder=consiliu-profesoral`);
            const data = await response.json();
            
            const profesoriPromises = (data.files || []).map(async (file: any) => {
                try {
                    const res = await fetch(file.url);
                    const json = await res.json();
                    return {
                        filename: file.filename,
                        url: file.url,
                        pathname: file.pathname,
                        ...json.profesor
                    };
                } catch (error) {
                    console.error(`Error parsing ${file.filename}:`, error);
                    return null;
                }
            });
            
            const allProfesori = (await Promise.all(profesoriPromises)).filter(p => p !== null);
            
            allProfesori.sort((a, b) => {
                const aOrder = a.order ?? 999;
                const bOrder = b.order ?? 999;
                if (aOrder !== bOrder) return aOrder - bOrder;
                return a.nume.localeCompare(b.nume);
            });
            
            setProfesori(allProfesori);
        } catch (error) {
            console.error('Error fetching profesori:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfesori();
    }, []);

    const handleAdd = async () => {
        if (!nume) {
            alert('Name is required!');
            return;
        }

        setUploading(true);
        try {
            const profesorData = {
                profesor: {
                    nume: nume.trim(),
                    order: profesori.length
                }
            };

            const sanitizedName = nume.replace(/[^a-zA-Z0-9_\-]/g, '_');
            const fileName = `${sanitizedName}.json`;
            const jsonBlob = new Blob([JSON.stringify(profesorData, null, 2)], { type: 'application/json' });

            const response = await fetch(
                `/api/blob/upload?filename=${encodeURIComponent(fileName)}&folder=consiliu-profesoral`,
                {
                    method: 'POST',
                    body: jsonBlob,
                }
            );

            if (response.ok) {
                alert('Profesor added successfully!');
                resetForm();
                await fetchProfesori();
            } else {
                alert('Failed to add profesor!');
            }
        } catch (error) {
            console.error('Error adding profesor:', error);
            alert('Error adding profesor!');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (profesor: Profesor) => {
        if (!confirm(`Delete ${profesor.nume}?`)) return;

        try {
            const response = await fetch(
                `/api/blob/delete?url=${encodeURIComponent(profesor.url)}`,
                { method: 'DELETE' }
            );

            if (response.ok) {
                await fetchProfesori();
            } else {
                alert('Failed to delete!');
            }
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Error deleting!');
        }
    };

    const moveUp = async (index: number) => {
        if (index === 0) return;
        const newProfesori = [...profesori];
        [newProfesori[index - 1], newProfesori[index]] = [newProfesori[index], newProfesori[index - 1]];
        await updateOrders(newProfesori);
    };

    const moveDown = async (index: number) => {
        if (index === profesori.length - 1) return;
        const newProfesori = [...profesori];
        [newProfesori[index], newProfesori[index + 1]] = [newProfesori[index + 1], newProfesori[index]];
        await updateOrders(newProfesori);
    };

    const updateOrders = async (newProfesori: Profesor[]) => {
        try {
            const updatePromises = newProfesori.map(async (profesor, idx) => {
                const data = {
                    profesor: {
                        nume: profesor.nume,
                        order: idx
                    }
                };

                await fetch(`/api/blob/delete?url=${encodeURIComponent(profesor.url)}`, { method: 'DELETE' });
                
                const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                return fetch(
                    `/api/blob/upload?filename=${encodeURIComponent(profesor.filename)}&folder=consiliu-profesoral`,
                    { method: 'POST', body: jsonBlob }
                );
            });

            await Promise.all(updatePromises);
            await fetchProfesori();
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
                    {showAddForm ? 'Cancel' : 'Add Profesor'}
                </Button>
            </div>

            {showAddForm && (
                <div key={formKey} className="mb-8 p-6 border-2 rounded-2xl shadow-2xl bg-gray-50">
                    <h3 className="text-2xl font-bold mb-4">Add New Profesor</h3>
                    
                    <input
                        ref={inputRefNume}
                        type="text"
                        value={nume}
                        onChange={(e) => setNume(e.target.value)}
                        placeholder="Nume Complet"
                        className="w-full p-2 mb-4 border-2 rounded-md"
                    />
                    
                    <Button
                        onClick={handleAdd}
                        disabled={uploading}
                        className="text-xl rounded-md shadow-xl bg-green-600 text-white hover:bg-green-700 font-bold"
                    >
                        {uploading ? 'Adding...' : 'Save Profesor'}
                    </Button>
                </div>
            )}

            <div className="h-[400px] overflow-y-scroll pr-2">
                {loading ? (
                    <div className="text-xl">Loading...</div>
                ) : profesori.length === 0 ? (
                    <div className="text-xl text-gray-500">No profesori added yet</div>
                ) : (
                    <div className="space-y-2">
                        {profesori.map((profesor, index) => (
                            <div key={profesor.filename} className="flex items-center gap-4 p-3 border-2 rounded-lg bg-white shadow-md">
                                <div className="flex-1">
                                    <p className="font-bold text-lg">{profesor.nume}</p>
                                </div>
                                
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => moveUp(index)}
                                        disabled={index === 0}
                                        className="p-2"
                                    >
                                        <ArrowUp className="w-5 h-5" />
                                    </Button>
                                    
                                    <Button
                                        onClick={() => moveDown(index)}
                                        disabled={index === profesori.length - 1}
                                        className="p-2"
                                    >
                                        <ArrowDown className="w-5 h-5" />
                                    </Button>
                                    
                                    <Button
                                        onClick={() => handleDelete(profesor)}
                                        className="p-2 bg-red-600 hover:bg-red-700"
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

export default ConsiliuProfesoralManager;

