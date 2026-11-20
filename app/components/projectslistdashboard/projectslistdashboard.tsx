"use client";

import React, { useEffect, useState } from "react";
import { ExternalLink, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { parseJsonResponse } from "@/lib/upload-client";

interface Project {
    title: string;
    photo: string;
    link: string;
    color: string;
    url: string;
    pathname?: string;
}

const ProjectsListDashboard = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/projects");
            const data = await response.json();
            setProjects(data.projects || []);
        } catch (error) {
            console.error("Error fetching projects:", error);
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
        const onChanged = () => fetchProjects();
        window.addEventListener("dashboard-projects-changed", onChanged);
        return () => window.removeEventListener("dashboard-projects-changed", onChanged);
    }, []);

    const handleDelete = async (project: Project) => {
        if (!confirm(`Ștergi proiectul „${project.title}”?`)) return;

        try {
            const deleteParam = project.pathname
                ? `pathname=${encodeURIComponent(project.pathname)}`
                : `url=${encodeURIComponent(project.url)}`;
            const response = await fetch(`/api/blob/delete?${deleteParam}`, { method: "DELETE" });
            if (!response.ok) {
                const errorData = await parseJsonResponse<{ error?: string }>(response);
                throw new Error(errorData.error || "Delete failed");
            }
            await fetchProjects();
        } catch (error) {
            alert(error instanceof Error ? error.message : "Eroare la ștergerea proiectului");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-indigo-900">Existente</p>
                <button
                    type="button"
                    onClick={fetchProjects}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-900/15 px-2.5 py-1.5 text-xs font-bold text-indigo-900 hover:bg-indigo-50"
                >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="flex items-center gap-2 py-8 text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Se încarcă...
                </div>
            ) : projects.length === 0 ? (
                <p className="rounded-xl border border-dashed border-indigo-900/15 px-4 py-10 text-center text-sm text-gray-500">
                    Niciun proiect încă.
                </p>
            ) : (
                <ul className="space-y-2 max-h-[640px] overflow-y-auto">
                    {projects.map((project, index) => (
                        <li
                            key={`${project.url}-${index}`}
                            className="flex items-center gap-3 rounded-xl border border-indigo-900/10 bg-indigo-50/30 px-3 py-3"
                        >
                            <img
                                src={project.photo}
                                alt=""
                                className="h-14 w-20 rounded-lg object-cover shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-indigo-950">{project.title}</p>
                                {project.link && (
                                    <p className="truncate text-xs text-gray-500 mt-0.5">{project.link}</p>
                                )}
                            </div>
                            <div
                                className="h-3 w-3 rounded-full border border-black/10 shrink-0"
                                style={{ backgroundColor: project.color }}
                            />
                            <div className="flex items-center gap-1">
                                {project.link && (
                                    <button
                                        type="button"
                                        onClick={() => window.open(project.link, "_blank")}
                                        className="rounded-lg p-2 text-indigo-900 hover:bg-white"
                                        title="Deschide"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleDelete(project)}
                                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                                    title="Șterge"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProjectsListDashboard;
