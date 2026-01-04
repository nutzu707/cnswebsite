"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Project {
    title: string;
    photo: string;
    link: string;
    color: string;
    url: string; // JSON file URL
    pathname?: string;
}

const ProjectsListDashboard = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/projects');
            const data = await response.json();
            setProjects(data.projects || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDelete = async (project: Project) => {
        if (!confirm(`Sigur doriți să ștergeți proiectul "${project.title}"?`)) {
            return;
        }

        try {
            // Use pathname if available, otherwise extract from URL
            const deleteParam = project.pathname 
                ? `pathname=${encodeURIComponent(project.pathname)}`
                : `url=${encodeURIComponent(project.url)}`;
            
            console.log('Deleting project:', deleteParam);
            const response = await fetch(
                `/api/blob/delete?${deleteParam}`,
                { method: 'DELETE' }
            );

            if (response.ok) {
                console.log('Delete successful');
                await fetchProjects();
                alert('Proiect șters cu succes!');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Delete failed');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            const errorMessage = error instanceof Error ? error.message : 'Eroare la ștergerea proiectului';
            alert(errorMessage);
        }
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Button
                    type="button"
                    onClick={fetchProjects}
                    className="text-xl rounded-md shadow-xl bg-white text-black border-2 border-solid hover:bg-gray-200 font-bold"
                >
                    Refresh
                </Button>
            </div>

            <div className="h-[300px] overflow-y-scroll pr-5">
                {loading ? (
                    <div className="text-xl">Loading...</div>
                ) : projects.length === 0 ? (
                    <div className="text-xl">Nu există proiecte disponibile</div>
                ) : (
                    <ul>
                        {projects.map((project, index) => (
                            <li key={index} className="flex w-full border-t-2 text-2xl py-4 items-center gap-4">
                                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                        src={project.photo}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 break-all">
                                    <div className="font-bold">{project.title}</div>
                                    {project.link && (
                                        <div className="text-sm text-gray-600 truncate">
                                            {project.link}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 mt-1">
                                        <div 
                                            className="w-4 h-4 rounded-full border-2" 
                                            style={{ backgroundColor: project.color }}
                                        ></div>
                                        <span className="text-xs text-gray-500">{project.color}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {project.link && (
                                        <Button
                                            onClick={() => window.open(project.link, '_blank')}
                                            className="text-xl rounded-md shadow-xl bg-blue-600 text-white border-2 border-solid hover:bg-blue-700 font-bold"
                                        >
                                            Link
                                        </Button>
                                    )}
                                    <Button
                                        onClick={() => handleDelete(project)}
                                        className="text-xl rounded-md shadow-xl bg-white text-black border-2 border-solid hover:bg-red-200 font-bold"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                <hr className="solid border-t-2" />
            </div>
        </div>
    );
};

export default ProjectsListDashboard;

