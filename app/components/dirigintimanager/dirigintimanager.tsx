"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";

interface Diriginte {
    filename: string;
    url: string;
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
    const inputRefNume = useRef<HTMLInputElement>(null);
    const inputRefClasa = useRef<HTMLInputElement>(null);
    const inputRefSala = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setShowAddForm(false);
        setTimeout(() => {
            setNume('');
            setClasa('');
            setSala('');
            if (inputRefNume.current) inputRefNume.current.value = '';
            if (inputRefClasa.current) inputRefClasa.current.value = '';
            if (inputRefSala.current) inputRefSala.current.value = '';
            setFormKey(prev => prev + 1);
        }, 0);
    };

    const toggleForm = () => {
        if (showAddForm) {
            setShowAddForm(false);
            setTimeout(() => {
                setNume('');
                setClasa('');
                setSala('');
                setFormKey(prev => prev + 1);
            }, 0);
        } else {
            setNume('');
            setClasa('');
            setSala('');
            setFormKey(prev => prev + 1);
            setTimeout(() => {
                setShowAddForm(true);
            }, 10);
        }
    };

    const fetchDiriginti = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/blob/list?folder=diriginti`);
            const data = await response.json();
            
            const dirigintiPromises = (data.files || []).map(async (file: any) => {
                try {
                    const res = await fetch(file.url);
                    const json = await res.json();
                    return {
                        filename: file.filename,
                        url: file.url,
                        pathname: file.pathname,
                        ...json.diriginte
                    };
                } catch (error) {
                    console.error(`Error parsing ${file.filename}:`, error);
                    return null;
                }
            });
            
            const allDiriginti = (await Promise.all(dirigintiPromises)).filter(d => d !== null);
            
            allDiriginti.sort((a, b) => {
                const aOrder = a.order ?? 999;
                const bOrder = b.order ?? 999;
                if (aOrder !== bOrder) return aOrder - bOrder;
                return a.nume.localeCompare(b.nume);
            });
            
            setDiriginti(allDiriginti);
        } catch (error) {
            console.error('Error fetching diriginti:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiriginti();
    }, []);

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
            const fileName = `${sanitizedName}_${clasa}.json`;
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
                resetForm();
                await fetchDiriginti();
            } else {
                alert('Failed to add diriginte!');
            }
        } catch (error) {
            console.error('Error adding diriginte:', error);
            alert('Error adding diriginte!');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (diriginte: Diriginte) => {
        if (!confirm(`Delete ${diriginte.nume}?`)) return;

        try {
            const response = await fetch(
                `/api/blob/delete?url=${encodeURIComponent(diriginte.url)}`,
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

                await fetch(`/api/blob/delete?url=${encodeURIComponent(diriginte.url)}`, { method: 'DELETE' });
                
                const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                return fetch(
                    `/api/blob/upload?filename=${encodeURIComponent(diriginte.filename)}&folder=diriginti`,
                    { method: 'POST', body: jsonBlob }
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
        <div>
            <div className="mb-4">
                <Button
                    onClick={toggleForm}
                    className="text-xl rounded-md shadow-xl bg-indigo-900 text-white hover:bg-indigo-950 font-bold"
                >
                    {showAddForm ? 'Cancel' : 'Add Diriginte'}
                </Button>
            </div>

            {showAddForm && (
                <div key={formKey} className="mb-8 p-6 border-2 rounded-2xl shadow-2xl bg-gray-50">
                    <h3 className="text-2xl font-bold mb-4">Add New Diriginte</h3>
                    
                    <input
                        ref={inputRefNume}
                        type="text"
                        value={nume}
                        onChange={(e) => setNume(e.target.value)}
                        placeholder="Nume"
                        className="w-full p-2 mb-4 border-2 rounded-md"
                    />
                    
                    <input
                        ref={inputRefClasa}
                        type="text"
                        value={clasa}
                        onChange={(e) => setClasa(e.target.value)}
                        placeholder="Clasa (e.g., 9A)"
                        className="w-full p-2 mb-4 border-2 rounded-md"
                    />
                    
                    <input
                        ref={inputRefSala}
                        type="text"
                        value={sala}
                        onChange={(e) => setSala(e.target.value)}
                        placeholder="Sala (e.g., 201)"
                        className="w-full p-2 mb-4 border-2 rounded-md"
                    />
                    
                    <Button
                        onClick={handleAdd}
                        disabled={uploading}
                        className="text-xl rounded-md shadow-xl bg-green-600 text-white hover:bg-green-700 font-bold"
                    >
                        {uploading ? 'Adding...' : 'Save Diriginte'}
                    </Button>
                </div>
            )}

            <div className="h-[400px] overflow-y-scroll pr-2">
                {loading ? (
                    <div className="text-xl">Loading...</div>
                ) : diriginti.length === 0 ? (
                    <div className="text-xl text-gray-500">No diriginti added yet</div>
                ) : (
                    <div className="space-y-2">
                        {diriginti.map((diriginte, index) => (
                            <div key={diriginte.filename} className="flex items-center gap-4 p-3 border-2 rounded-lg bg-white shadow-md">
                                <div className="flex-1 grid grid-cols-3 gap-2">
                                    <p className="font-bold">{diriginte.nume}</p>
                                    <p className="text-gray-600">{diriginte.clasa}</p>
                                    <p className="text-gray-600">{diriginte.sala}</p>
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
                                        disabled={index === diriginti.length - 1}
                                        className="p-2"
                                    >
                                        <ArrowDown className="w-5 h-5" />
                                    </Button>
                                    
                                    <Button
                                        onClick={() => handleDelete(diriginte)}
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

export default DirigintiManager;

