'use client';

import { useState, useEffect } from 'react';
import uploadConsiliuProfesoralToServer from "@/app/components/uploadconsiliuprofesoraltoserver/uploadconsiliuprofesoraltoserver";

interface Profesor {
    nume: string;
}

const ModifyConsiliuProfesoral = () => {
    const [profesori, setProfesori] = useState<Profesor[]>([]);
    const [loading, setLoading] = useState(true);
    const [newProfesor, setNewProfesor] = useState<string>('');

    useEffect(() => {
        const fetchProfesori = async () => {
            try {
                const response = await fetch('/assets/uploads/documents/consiliu-profesoral.json');
                const data = await response.json();
                setProfesori(data.profesori.content || []);
            } catch (error) {
                console.error('Error loading profesori:', error);
                setProfesori([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProfesori();
    }, []);

    const addProfesor = () => {
        if (!newProfesor.trim()) {
            alert('Numele este obligatoriu!');
            return;
        }
        setProfesori([...profesori, { nume: newProfesor.trim() }]);
        setNewProfesor('');
    };

    const updateProfesor = (index: number, value: string) => {
        const updated = [...profesori];
        updated[index] = { nume: value };
        setProfesori(updated);
    };

    const deleteProfesor = (index: number) => {
        if (confirm('Sigur doriți să ștergeți acest profesor?')) {
            setProfesori(profesori.filter((_, i) => i !== index));
        }
    };

    const saveChanges = () => {
        const jsonObject = {
            "ATENTIE!": "ORDINEA IN CARE APAR NUMELE IN ACEST FISIER ESTE IRELEVANTA, EI SUNT MEREU SORTATI ALFABETIC PE PAGINA",
            profesori: {
                content: profesori
            }
        };

        const jsonBlob = new Blob([JSON.stringify(jsonObject, null, 2)], {
            type: 'application/json',
        });

        uploadConsiliuProfesoralToServer('consiliu-profesoral.json', jsonBlob);
    };

    if (loading) {
        return <div className="text-center p-4">Se încarcă...</div>;
    }

    return (
        <div className="w-full">
            <div className="rounded-md shadow-2xl border-2 p-4 mb-4">
                <p className="text-2xl font-bold mb-4">Adaugă Profesor Nou</p>
                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        value={newProfesor}
                        onChange={(e) => setNewProfesor(e.target.value)}
                        placeholder="Nume Profesor"
                        className="border-2 p-1 shadow-xl rounded-md text-center"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                addProfesor();
                            }
                        }}
                    />
                    <button
                        onClick={addProfesor}
                        className="text-xl rounded-md shadow-xl bg-white text-black border-2 border-solid hover:bg-gray-200 font-bold p-2"
                    >
                        Adaugă Profesor
                    </button>
                </div>
            </div>

            <div className="rounded-md shadow-2xl border-2 p-4 mb-4">
                <p className="text-2xl font-bold mb-4">Lista Profesori ({profesori.length})</p>
                <div className="max-h-[400px] overflow-y-auto space-y-2">
                    {profesori.map((profesor, index) => (
                        <div key={index} className="border-2 p-2 rounded-md">
                            <div className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    value={profesor.nume}
                                    onChange={(e) => updateProfesor(index, e.target.value)}
                                    className="border-2 p-1 rounded-md flex-1"
                                />
                                <button
                                    onClick={() => deleteProfesor(index)}
                                    className="text-lg rounded-md shadow-xl bg-red-500 text-white border-2 border-solid hover:bg-red-600 font-bold p-1 px-4"
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

export default ModifyConsiliuProfesoral;

