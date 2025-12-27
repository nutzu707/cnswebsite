'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import uploadConducerePersonToServer from "@/app/components/uploadconducerepersontoserver/uploadconducerepersontoserver";
import deletePersonFile from "@/app/components/deletepersonfile/deletepersonfile";

type Person = {
    name: string;
    position: string;
    photo: string;
    order: number;
    filename?: string;
};

const ModifyConducere = () => {
    const [people, setPeople] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [newPerson, setNewPerson] = useState<Person>({
        name: '',
        position: '',
        photo: '',
        order: 1,
    });
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchPeople = async () => {
            try {
                const response = await fetch('/api/conducere');
                const data = await response.json();
                const list: Person[] = (data.people || []).map((item: any) => ({
                    name: item.person.name,
                    position: item.person.position,
                    photo: item.person.photo,
                    order: item.person.order ?? Number.MAX_SAFE_INTEGER,
                    filename: item.filename,
                }));
                setPeople(list);
            } catch (error) {
                console.error('Error loading conducere:', error);
                setPeople([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPeople();
    }, []);

    const handlePhotoUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result as string;
            setPhotoPreview(base64);
            setNewPerson((prev) => ({ ...prev, photo: base64 }));
        };
        reader.readAsDataURL(file);
    };

    const addPerson = () => {
        if (!newPerson.name || !newPerson.position || !newPerson.photo || newPerson.order === undefined || newPerson.order === null) {
            alert('Nume, Pozitie, Poză și Ordine sunt obligatorii!');
            return;
        }
        const sanitizedName = newPerson.name.replace(/[^a-zA-Z0-9_\-]/g, '_');
        const filename = `${sanitizedName || 'untitled'}.json`;
        setPeople([...people, { ...newPerson, filename }]);
        setNewPerson({ name: '', position: '', photo: '', order: 1 });
        setPhotoPreview(null);
    };

    const updatePersonField = (index: number, field: keyof Person, value: string | number) => {
        const updated = [...people];
        // @ts-ignore
        updated[index][field] = value;
        setPeople(updated);
    };

    const deletePerson = async (index: number) => {
        const person = people[index];
        const filename = person.filename;
        const updated = people.filter((_, i) => i !== index);
        setPeople(updated);
        if (filename) {
            try {
                await deletePersonFile('conducere', filename);
            } catch (e) {
                console.error('Delete failed', e);
            }
        }
    };

    const saveAll = async () => {
        const tasks = people.map(async (p) => {
            if (!p.name || !p.position || !p.photo || p.order === undefined || p.order === null) {
                throw new Error('Toate câmpurile sunt obligatorii pentru fiecare persoană.');
            }
            const fileName = p.filename || `${p.name.replace(/[^a-zA-Z0-9_\-]/g, '_') || 'untitled'}.json`;
            const jsonObject = {
                person: {
                    name: p.name,
                    position: p.position,
                    photo: p.photo,
                    order: Number(p.order),
                },
            };
            const blob = new Blob([JSON.stringify(jsonObject, null, 2)], { type: 'application/json' });
            await uploadConducerePersonToServer(fileName, blob);
        });

        try {
            await Promise.all(tasks);
            alert('Salvat cu succes!');
        } catch (error) {
            console.error('Save failed', error);
            alert('Eroare la salvare. Verificați câmpurile.');
        }
    };

    if (loading) {
        return <div className="text-center p-4">Se încarcă...</div>;
    }

    return (
        <div className="w-full">
            <div className="rounded-md shadow-2xl border-2 p-4 mb-4">
                <p className="text-2xl font-bold mb-4">Adaugă persoană</p>
                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        value={newPerson.name}
                        onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                        placeholder="Nume"
                        className="border-2 p-1 shadow-xl rounded-md text-center"
                    />
                    <input
                        type="text"
                        value={newPerson.position}
                        onChange={(e) => setNewPerson({ ...newPerson, position: e.target.value })}
                        placeholder="Pozitie"
                        className="border-2 p-1 shadow-xl rounded-md text-center"
                    />
                    <input
                        type="number"
                        value={newPerson.order}
                        onChange={(e) => setNewPerson({ ...newPerson, order: Number(e.target.value) })}
                        placeholder="Ordine"
                        className="border-2 p-1 shadow-xl rounded-md text-center"
                        min={1}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files && handlePhotoUpload(e.target.files[0])}
                        className="w-[300px] mt-1 file:bg-white bg-none file:cursor-pointer file:border-gray-300 file:border-2 file:rounded-md file:hover:bg-gray-200 file:shadow-xl file:text-xl"
                    />
                    {photoPreview && (
                        <div>
                            <img
                                src={photoPreview}
                                alt="Photo Preview"
                                className="rounded-full shadow-2xl mt-4 w-[200px] h-[200px] object-cover"
                            />
                        </div>
                    )}
                    <button
                        onClick={addPerson}
                        className="text-xl rounded-md shadow-xl bg-white text-black border-2 border-solid hover:bg-gray-200 font-bold p-2"
                    >
                        Adaugă
                    </button>
                </div>
            </div>

            <div className="rounded-md shadow-2xl border-2 p-4 mb-4">
                <p className="text-2xl font-bold mb-4">Listă persoane (ordonare obligatorie)</p>
                <div className="max-h-[400px] overflow-y-auto space-y-3">
                    {people.map((person, index) => (
                        <div key={index} className="border-2 p-2 rounded-md">
                            <div className="flex flex-col gap-2">
                                <input
                                    type="text"
                                    value={person.name}
                                    onChange={(e) => updatePersonField(index, 'name', e.target.value)}
                                    className="border-2 p-1 rounded-md"
                                />
                                <input
                                    type="text"
                                    value={person.position}
                                    onChange={(e) => updatePersonField(index, 'position', e.target.value)}
                                    className="border-2 p-1 rounded-md"
                                />
                                <input
                                    type="number"
                                    value={person.order}
                                    onChange={(e) => updatePersonField(index, 'order', Number(e.target.value))}
                                    className="border-2 p-1 rounded-md"
                                    min={1}
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => deletePerson(index)}
                                        className="text-lg rounded-md shadow-xl bg-red-500 text-white border-2 border-solid hover:bg-red-600 font-bold p-1 px-4"
                                    >
                                        Șterge
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={saveAll}
                className="text-xl rounded-md shadow-xl bg-white text-black border-2 border-solid hover:bg-gray-200 font-bold mt-4 p-2 mb-16 w-full"
            >
                Salvează toate modificările
            </button>
        </div>
    );
};

export default ModifyConducere;
