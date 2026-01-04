"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Trash2, Loader2 } from "lucide-react";

interface Diriginte {
    filename: string;
    url: string;
    pathname: string;
    nume: string;
    clasa: string;
    sala: string;
    order?: number;
}

const DirigintiManager = () => {
    const [diriginti, setDiriginti] = useState<Diriginte[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formKey, setFormKey] = useState(0);
    
    const [nume, setNume] = useState("");
    const [clasa, setClasa] = useState("");
    const [sala, setSala] = useState("");
    const [uploading, setUploading] = useState(false);

    const fetchDiriginti = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/diriginti');
            const data = await response.json();
            setDiriginti(data.diriginti || []);
        } catch (error) {
            console.error('Error fetching diriginti:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiriginti();
    }, []);

    const resetForm = () => {
        setNume('');
        setClasa('');
        setSala('');
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
        if (!nume || !clasa || !sala) {
            alert('All fields are required!');
            return;
        }

        setUploading(true);
        try {
            const diriginteData = {
                diriginte: {
                    nume: nume.trim(),
                    clasa: clasa.trim(),
                    sala: sala.trim(),
                    order: diriginti.length
                }
            };

            const sanitizedName = nume.replace(/[^a-zA-Z0-9_\-]/g, '_');
            const fileName = `${sanitizedName}_${clasa.replace(/[^a-zA-Z0-9_\-]/g, '_')}.json`;
            const jsonBlob = new Blob([JSON.stringify(diriginteData, null, 2)], { type: 'application/json' });

            const response = await fetch(
                `/api/blob/upload?filename=${encodeURIComponent(fileName)}&folder=diriginti`,
                {
                    method: 'POST',
                    body: jsonBlob,
                }
            );

            if (response.ok) {
                alert('Diriginte added successfully!');
                setShowAddForm(false);
                resetForm();
                await fetchDiriginti();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add diriginte');
            }
        } catch (error) {
            console.error('Error adding diriginte:', error);
            alert(error instanceof Error ? error.message : 'Error adding diriginte!');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (diriginte: Diriginte) => {
        if (!confirm(`Delete ${diriginte.nume} - ${diriginte.clasa}?`)) return;

        try {
            const response = await fetch(
                `/api/blob/delete?pathname=${encodeURIComponent(diriginte.pathname)}`,
                { method: 'DELETE' }
            );

            if (response.ok) {
                await fetchDiriginti();
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
        const newDiriginti = [...diriginti];
        [newDiriginti[index - 1], newDiriginti[index]] = [newDiriginti[index], newDiriginti[index - 1]];
        await updateOrders(newDiriginti);
    };

    const moveDown = async (index: number) => {
        if (index === diriginti.length - 1) return;
        const newDiriginti = [...diriginti];
        [newDiriginti[index], newDiriginti[index + 1]] = [newDiriginti[index + 1], newDiriginti[index]];
        await updateOrders(newDiriginti);
    };

    const updateOrders = async (newDiriginti: Diriginte[]) => {
        try {
            const updatePromises = newDiriginti.map(async (diriginte, idx) => {
                const data = {
                    diriginte: {
                        nume: diriginte.nume,
                        clasa: diriginte.clasa,
                        sala: diriginte.sala,
                        order: idx
                    }
                };

                await fetch(`/api/blob/delete?pathname=${encodeURIComponent(diriginte.pathname)}`, { method: 'DELETE' });
                
                const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                return fetch(
                    `/api/blob/upload?filename=${encodeURIComponent(diriginte.filename)}&folder=diriginti`,
                    {
                        method: 'POST',
                        body: jsonBlob,
                    }
                );
            });

            await Promise.all(updatePromises);
            await fetchDiriginti();
        } catch (error) {
            console.error('Error updating orders:', error);
            alert('Error updating order!');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Diriginți</h2>
                <Button
                    onClick={toggleForm}
                    className="rounded-md shadow-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                    {showAddForm ? 'Cancel' : 'Add Diriginte'}
                </Button>
            </div>

            {showAddForm && (
                <div key={formKey} className="p-6 border-2 rounded-xl shadow-lg bg-white">
                    <h3 className="text-xl font-bold mb-6">Add New Diriginte</h3>
                    
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
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">Clasa</label>
                            <input
                                type="text"
                                value={clasa}
                                onChange={(e) => setClasa(e.target.value)}
                                placeholder="Enter class (e.g., 9A)"
                                className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">Sala</label>
                            <input
                                type="text"
                                value={sala}
                                onChange={(e) => setSala(e.target.value)}
                                placeholder="Enter room number"
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
                            'Save Diriginte'
                        )}
                    </Button>
                </div>
            )}

            <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                ) : diriginti.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No diriginți added yet</div>
                ) : (
                    diriginti.map((diriginte, index) => (
                        <div key={diriginte.filename} className="flex items-center gap-4 p-4 border-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-lg">{diriginte.nume}</p>
                                <p className="text-gray-600 text-sm">
                                    <span className="font-medium">Clasa:</span> {diriginte.clasa} | 
                                    <span className="font-medium ml-2">Sala:</span> {diriginte.sala}
                                </p>
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
                                    disabled={index === diriginti.length - 1}
                                    variant="outline"
                                    size="icon"
                                    title="Move Down"
                                    className="h-9 w-9"
                                >
                                    <ArrowDown className="w-4 h-4" />
                                </Button>
                                
                                <Button
                                    onClick={() => handleDelete(diriginte)}
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

export default DirigintiManager;
