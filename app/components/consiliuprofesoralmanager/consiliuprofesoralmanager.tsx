"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Trash2, Loader2 } from "lucide-react";

interface Profesor {
    filename: string;
    url: string;
    pathname: string;
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

    const fetchProfesori = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/consiliu-profesoral');
            const data = await response.json();
            setProfesori(data.profesori || []);
        } catch (error) {
            console.error('Error fetching profesori:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfesori();
    }, []);

    const resetForm = () => {
        setNume('');
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
                setShowAddForm(false);
                resetForm();
                await fetchProfesori();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add profesor');
            }
        } catch (error) {
            console.error('Error adding profesor:', error);
            alert(error instanceof Error ? error.message : 'Error adding profesor!');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (profesor: Profesor) => {
        if (!confirm(`Delete ${profesor.nume}?`)) return;

        try {
            const response = await fetch(
                `/api/blob/delete?pathname=${encodeURIComponent(profesor.pathname)}`,
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

                await fetch(`/api/blob/delete?pathname=${encodeURIComponent(profesor.pathname)}`, { method: 'DELETE' });
                
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Consiliu Profesoral</h2>
                <Button
                    onClick={toggleForm}
                    className="rounded-md shadow-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                    {showAddForm ? 'Cancel' : 'Add Profesor'}
                </Button>
            </div>

            {showAddForm && (
                <div key={formKey} className="p-6 border-2 rounded-xl shadow-lg bg-white">
                    <h3 className="text-xl font-bold mb-6">Add New Profesor</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Nume</label>
                            <input
                                type="text"
                                value={nume}
                                onChange={(e) => setNume(e.target.value)}
                                placeholder="Enter name"
                                className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                    
                    <Button
                        onClick={handleAdd}
                        disabled={uploading}
                        className="mt-6 w-full rounded-lg shadow-md bg-green-600 text-white hover:bg-green-700 font-medium py-3"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin inline" />
                                Adding...
                            </>
                        ) : (
                            'Save Profesor'
                        )}
                    </Button>
                </div>
            )}

            <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                ) : profesori.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No profesori added yet</div>
                ) : (
                    profesori.map((profesor, index) => (
                        <div key={profesor.filename} className="flex items-center gap-4 p-4 border-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-lg">{profesor.nume}</p>
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
                                    disabled={index === profesori.length - 1}
                                    variant="outline"
                                    size="icon"
                                    title="Move Down"
                                    className="h-9 w-9"
                                >
                                    <ArrowDown className="w-4 h-4" />
                                </Button>
                                
                                <Button
                                    onClick={() => handleDelete(profesor)}
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

export default ConsiliuProfesoralManager;
