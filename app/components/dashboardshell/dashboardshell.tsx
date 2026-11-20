"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    Bell,
    BookOpen,
    Building2,
    ChevronRight,
    FileText,
    FolderOpen,
    GraduationCap,
    Image as ImageIcon,
    LayoutDashboard,
    Menu,
    Newspaper,
    Trophy,
    Users,
    UsersRound,
    X,
} from "lucide-react";
import DocumentsListBlob from "@/app/components/displaydocumentsblob/displaydocumentsblob";
import BlobStorageIndicator from "@/app/components/blobstorageindicator/blobstorageindicator";
import PersonManager from "@/app/components/personmanager/personmanager";
import DirigintiManager from "@/app/components/dirigintimanager/dirigintimanager";
import ConsiliuProfesoralManager from "@/app/components/consiliuprofesoralmanager/consiliuprofesoralmanager";
import CatedreManager from "@/app/components/catedremanager/catedremanager";
import CreateProjectJsonFile from "@/app/components/createproject/createproject";
import CreateNews from "@/app/components/createnewsarticle/createnewsarticle";
import NewsListDashboard from "@/app/components/newslistdashboard/newslistdashboard";
import ProjectsListDashboard from "@/app/components/projectslistdashboard/projectslistdashboard";
import ModifyNavbarLinks from "@/app/components/modifynavbarlinks/modifynavbarlinks";
import LogoutButton from "@/app/components/logoutbutton/logoutbutton";

type SectionId =
    | "overview"
    | "management"
    | "elevi"
    | "profesori"
    | "cjex"
    | "premii"
    | "anunturi"
    | "proiecte"
    | "orar"
    | "conducere"
    | "consiliu"
    | "diriginti"
    | "consiliu-profesoral"
    | "catedre";

type NavItem = {
    id: SectionId;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
};

type NavGroup = {
    title: string;
    items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
    {
        title: "General",
        items: [
            {
                id: "overview",
                label: "Prezentare generală",
                description: "Stocare și acces rapid",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: "Documente",
        items: [
            { id: "management", label: "Management", description: "Documente management", icon: Building2 },
            { id: "elevi", label: "Elevi", description: "Documente elevi", icon: GraduationCap },
            { id: "profesori", label: "Profesori", description: "Documente profesori", icon: BookOpen },
            { id: "cjex", label: "CJEX Sălaj", description: "Documente CJEX", icon: FolderOpen },
            { id: "premii", label: "Premii", description: "Documente premii", icon: Trophy },
        ],
    },
    {
        title: "Conținut",
        items: [
            { id: "anunturi", label: "Anunțuri", description: "Publică anunțuri", icon: Newspaper },
            { id: "proiecte", label: "Proiecte", description: "Gestionează proiecte", icon: FileText },
            { id: "orar", label: "Orar", description: "PDF orar navbar", icon: Bell },
        ],
    },
    {
        title: "Persoane",
        items: [
            { id: "conducere", label: "Conducere", description: "Membrii conducerii", icon: Users },
            { id: "consiliu", label: "Consiliu Admin", description: "Consiliu administrație", icon: UsersRound },
            { id: "diriginti", label: "Diriginți", description: "Lista diriginților", icon: Users },
            { id: "consiliu-profesoral", label: "Consiliu Profesoral", description: "Consiliu profesoral", icon: UsersRound },
            { id: "catedre", label: "Catedre", description: "Fotografii catedre", icon: ImageIcon },
        ],
    },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((group) => group.items);

function Panel({ children }: { children: React.ReactNode }) {
    return (
        <div className="animate-fadeIn rounded-2xl border border-indigo-900/10 bg-white p-4 sm:p-6 lg:p-8 shadow-sm">
            {children}
        </div>
    );
}

export default function DashboardShell() {
    const [activeId, setActiveId] = useState<SectionId>("overview");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const activeItem = useMemo(
        () => ALL_ITEMS.find((item) => item.id === activeId) || ALL_ITEMS[0],
        [activeId]
    );

    useEffect(() => {
        const saved = window.localStorage.getItem("dashboard-active-section");
        if (saved && ALL_ITEMS.some((item) => item.id === saved)) {
            setActiveId(saved as SectionId);
        }
    }, []);

    const selectSection = (id: SectionId) => {
        setActiveId(id);
        window.localStorage.setItem("dashboard-active-section", id);
        setSidebarOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const renderContent = () => {
        switch (activeId) {
            case "overview":
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <BlobStorageIndicator compact />
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                            {ALL_ITEMS.filter((item) => item.id !== "overview").map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => selectSection(item.id)}
                                        className="group text-left rounded-2xl border border-indigo-900/10 bg-white p-5 shadow-sm hover:border-indigo-900/30 hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-900 group-hover:bg-indigo-900 group-hover:text-white transition-colors">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-indigo-900 transition-colors" />
                                        </div>
                                        <p className="mt-4 text-lg font-bold text-indigo-900">{item.label}</p>
                                        <p className="mt-1 text-sm text-gray-600 font-normal">{item.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            case "management":
                return (
                    <Panel>
                        <DocumentsListBlob folder="documents/documente-management" />
                    </Panel>
                );
            case "elevi":
                return (
                    <Panel>
                        <DocumentsListBlob folder="documents/documente-elevi" />
                    </Panel>
                );
            case "profesori":
                return (
                    <Panel>
                        <DocumentsListBlob folder="documents/documente-profesori" />
                    </Panel>
                );
            case "cjex":
                return (
                    <Panel>
                        <DocumentsListBlob folder="documents/cjex-salaj" />
                    </Panel>
                );
            case "premii":
                return (
                    <Panel>
                        <DocumentsListBlob folder="documents/premii" />
                    </Panel>
                );
            case "anunturi":
                return (
                    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 animate-fadeIn">
                        <Panel>
                            <CreateNews />
                        </Panel>
                        <Panel>
                            <NewsListDashboard />
                        </Panel>
                    </div>
                );
            case "proiecte":
                return (
                    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 animate-fadeIn">
                        <Panel>
                            <CreateProjectJsonFile />
                        </Panel>
                        <Panel>
                            <ProjectsListDashboard />
                        </Panel>
                    </div>
                );
            case "orar":
                return (
                    <Panel>
                        <ModifyNavbarLinks />
                    </Panel>
                );
            case "conducere":
                return (
                    <Panel>
                        <PersonManager
                            folder="conducere"
                            title="Conducere"
                            apiEndpoint="/api/conducere"
                            hideTitle
                        />
                    </Panel>
                );
            case "consiliu":
                return (
                    <Panel>
                        <PersonManager
                            folder="consiliu-de-administratie"
                            title="Consiliu de Administratie"
                            apiEndpoint="/api/consiliu-de-administratie"
                            hideTitle
                        />
                    </Panel>
                );
            case "diriginti":
                return (
                    <Panel>
                        <DirigintiManager hideTitle />
                    </Panel>
                );
            case "consiliu-profesoral":
                return (
                    <Panel>
                        <ConsiliuProfesoralManager hideTitle />
                    </Panel>
                );
            case "catedre":
                return (
                    <Panel>
                        <CatedreManager />
                    </Panel>
                );
            default:
                return null;
        }
    };

    const sidebarContent = (
        <div className="flex h-full flex-col">
            <div className="border-b border-indigo-900/10 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-900/50">CNS Admin</p>
                <h1 className="mt-1 text-xl font-bold text-indigo-900">Dashboard</h1>
                <p className="mt-1 text-xs text-gray-500 font-normal">Colegiul Național „Silvania”</p>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-5">
                {NAV_GROUPS.map((group) => (
                    <div key={group.title}>
                        <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-900/40">
                            {group.title}
                        </p>
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                const active = item.id === activeId;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => selectSection(item.id)}
                                        className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                                            active
                                                ? "bg-indigo-900 text-white shadow-sm"
                                                : "text-indigo-950/80 hover:bg-indigo-50"
                                        }`}
                                    >
                                        <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-indigo-900"}`} />
                                        <span className="text-sm font-bold truncate">{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="border-t border-indigo-900/10 p-4">
                <LogoutButton />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f5f7fb] pt-[88px]">
            <div className="flex min-h-[calc(100vh-88px)] w-full">
                <aside className="hidden lg:flex sticky top-[88px] h-[calc(100vh-88px)] w-[280px] shrink-0 flex-col border-r border-indigo-900/10 bg-white">
                    {sidebarContent}
                </aside>

                {sidebarOpen && (
                    <div className="lg:hidden fixed inset-0 z-[60]">
                        <button
                            type="button"
                            className="absolute inset-0 bg-indigo-950/40"
                            aria-label="Închide meniul"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <aside className="absolute left-0 top-0 h-full w-[300px] bg-white shadow-2xl">
                            <div className="flex items-center justify-between border-b border-indigo-900/10 px-4 py-3">
                                <p className="font-bold text-indigo-900">Meniu</p>
                                <button
                                    type="button"
                                    onClick={() => setSidebarOpen(false)}
                                    className="rounded-lg p-2 hover:bg-indigo-50"
                                >
                                    <X className="h-5 w-5 text-indigo-900" />
                                </button>
                            </div>
                            <div className="h-[calc(100%-57px)]">{sidebarContent}</div>
                        </aside>
                    </div>
                )}

                <div className="flex min-w-0 flex-1 flex-col">
                    <header className="sticky top-[88px] z-40 border-b border-indigo-900/10 bg-[#f5f7fb]/95 backdrop-blur">
                        <div className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
                            <button
                                type="button"
                                className="lg:hidden rounded-xl border border-indigo-900/10 bg-white p-2.5 shadow-sm"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="h-5 w-5 text-indigo-900" />
                            </button>
                            <div className="min-w-0">
                                <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-900/45">
                                    Secțiune
                                </p>
                                <h2 className="truncate text-lg sm:text-xl font-bold text-indigo-900">
                                    {activeItem.label}
                                </h2>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 w-full">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
}
