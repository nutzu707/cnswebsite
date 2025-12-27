'use client';

import { useState, useEffect } from 'react';
import uploadDirigintiToServer from "@/app/components/uploaddirigintitoserver/uploaddirigintitoserver";

interface Diriginte {
    nume: string;
    clasa: string;
    sala: string;
}

const ModifyDiriginti = () => {
    const [diriginti, setDiriginti] = useState<Diriginte[]>([]);
    const [loading, setLoading] = useState(true);
    const [newDiriginte, setNewDiriginte] = useState<Diriginte>({ nume: '', clasa: '', sala: '' });

    useEffect(() => {
        const fetchDiriginti = async () => {
            try {
                const response = await fetch('/assets/uploads/documents/diriginti.json');
                const data = await response.json();
                setDiriginti(data.diriginti.content || []);
            } catch (error) {
                console.error('Error loading diriginti:', error);
                setDiriginti([]);
            } finally {
                setLoading(false);
            }
        };
        fetchDiriginti();
    }, []);

    const addDiriginte = () => {
        if (!newDiriginte.nume || !newDiriginte.clasa || !newDiriginte.sala) {
            alert('Toate câmpurile sunt obligatorii!');
            return;
        }
        setDiriginti([...diriginti, { ...newDiriginte }]);
        setNewDiriginte({ nume: '', clasa: '', sala: '' });
    };

    const updateDiriginte = (index: number, field: keyof Diriginte, value: string) => {
        const updated = [...diriginti];
        updated[index] = { ...updated[index], [field]: value };
        setDiriginti(updated);
    };

    const deleteDiriginte = (index: number) => {
        if (confirm('Sigur doriți să ștergeți acest diriginte?')) {
            setDiriginti(diriginti.filter((_, i) => i !== index));
        }
    };

    const saveChanges = () => {
        const jsonObject = {
            "ATENTIE!": "ORDINEA IN CARE APAR NUMELE IN ACEST FISIER ESTE IRELEVANTA, EI SUNT MEREU SORTATI ALFABETIC PE PAGINA",
            diriginti: {
                content: diriginti
            }
        };

        const jsonBlob = new Blob([JSON.stringify(jsonObject, null, 2)], {
            type: 'application/json',
        });

        uploadDirigintiToServer('diriginti.json', jsonBlob);
    };

    if (loading) {
        return <div className="text-center p-4">Se încarcă...</div>;
    }

    return (
        <div className="w-full">
            <div className="rounded-md shadow-2xl border-2 p-4 mb-4">
                <p className="text-2xl font-bold mb-4">Adaugă Diriginte Nou</p>
                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        value={newDiriginte.nume}
                        onChange={(e) => setNewDiriginte({ ...newDiriginte, nume: e.target.value })}
                        placeholder="Nume"
                        className="border-2 p-1 shadow-xl rounded-md text-center"
                    />
                    <input
                        type="text"
                        value={newDiriginte.clasa}
                        onChange={(e) => setNewDiriginte({ ...newDiriginte, clasa: e.target.value })}
                        placeholder="Clasă"
                        className="border-2 p-1 shadow-xl rounded-md text-center"
                    />
                    <input
                        type="text"
                        value={newDiriginte.sala}
                        onChange={(e) => setNewDiriginte({ ...newDiriginte, sala: e.target.value })}
                        placeholder="Sală"
                        className="border-2 p-1 shadow-xl rounded-md text-center"
                    />
                    <button
                        onClick={addDiriginte}
                        className="text-xl rounded-md shadow-xl bg-white text-black border-2 border-solid hover:bg-gray-200 font-bold p-2"
                    >
                        Adaugă Diriginte
                    </button>
                </div>
            </div>

            <div className="rounded-md shadow-2xl border-2 p-4 mb-4">
                <p className="text-2xl font-bold mb-4">Lista Diriginți ({diriginti.length})</p>
                <div className="max-h-[400px] overflow-y-auto space-y-2">
                    {diriginti.map((diriginte, index) => (
                        <div key={index} className="border-2 p-2 rounded-md">
                            <div className="flex flex-col gap-2">
                                <input
                                    type="text"
                                    value={diriginte.nume}
                                    onChange={(e) => updateDiriginte(index, 'nume', e.target.value)}
                                    className="border-2 p-1 rounded-md"
                                />
                                <input
                                    type="text"
                                    value={diriginte.clasa}
                                    onChange={(e) => updateDiriginte(index, 'clasa', e.target.value)}
                                    className="border-2 p-1 rounded-md"
                                />
                                <input
                                    type="text"
                                    value={diriginte.sala}
                                    onChange={(e) => updateDiriginte(index, 'sala', e.target.value)}
                                    className="border-2 p-1 rounded-md"
                                />
                                <button
                                    onClick={() => deleteDiriginte(index)}
                                    className="text-lg rounded-md shadow-xl bg-red-500 text-white border-2 border-solid hover:bg-red-600 font-bold p-1"
                                >
                                    Șterge
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={saveChanges}
                className="text-xl rounded-md shadow-xl bg-white text-black border-2 border-solid hover:bg-gray-200 font-bold mt-4 p-2 mb-16 w-full"
            >
                Salvează Modificările
            </button>
        </div>
    );
};

export default ModifyDiriginti;

