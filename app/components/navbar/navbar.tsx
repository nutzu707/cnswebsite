"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import NavbarButton from "@/app/components/navbarbutton/navbarbutton";
import SocialLinks from "@/app/components/sociallinks/sociallinks";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
    const pathname = usePathname();
    const [navbarLinks, setNavbarLinks] = useState({ orar: "" });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    let zoomlvl = 100;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const fetchNavbarConfig = async () => {
            try {
                const response = await fetch("/api/navbar-links");
                if (response.ok) {
                    const data = await response.json();
                    setNavbarLinks({ orar: data.orar || "" });
                }
            } catch (error) {
                console.error("Error loading navbar config:", error);
            }
        };
        fetchNavbarConfig();
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
        setExpandedSection(null);
    }, [pathname]);

    useEffect(() => {
        if (!isMenuOpen) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isMenuOpen]);

    const managementOptions = [
        { title: "Documente", link: "/management-documente" },
        { title: "Conducere", link: "/conducere" },
        { title: "Consiliu de Administratie", link: "/consiliu-de-administratie" },
    ];
    const eleviOptions = [
        { title: "Documente", link: "/elevi-documente" },
        ...(navbarLinks.orar ? [{ title: "Orar", link: navbarLinks.orar }] : []),
        { title: "Premii", link: "/premii" },
        { title: "CJEX Sălaj", link: "/cjex-salaj" },
    ];
    const profesoriOptions = [
        { title: "Documente", link: "/profesori-documente" },
        { title: "Consiliu Profesoral", link: "/consiliu-profesoral" },
        { title: "Catedre", link: "/catedre" },
        { title: "Diriginti", link: "/diriginti" },
    ];

    const zoomIn = () => {
        if (zoomlvl < 150) zoomlvl += 10;
        document.body.style.zoom = zoomlvl + "%";
    };

    const zoomOut = () => {
        if (zoomlvl > 100) zoomlvl -= 10;
        document.body.style.zoom = zoomlvl + "%";
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        setExpandedSection(null);
    };

    const toggleSection = (section: string) => {
        setExpandedSection((prev) => (prev === section ? null : section));
    };

    const mobileMenu =
        mounted &&
        createPortal(
            <div
                className={`fixed inset-0 z-[60] bg-brand-cream transition-transform duration-300 ease-out lg:hidden ${
                    isMenuOpen ? "translate-x-0" : "pointer-events-none translate-x-full"
                }`}
                aria-hidden={!isMenuOpen}
            >
                <div className="flex h-16 items-center justify-between border-b-2 border-gray-200 px-4">
                    <Link href="/" onClick={closeMenu}>
                        <Image
                            src="/websiteUI/logo.png"
                            alt="Logo"
                            width={48}
                            height={48}
                            className="h-12 w-12 object-contain"
                            style={{ imageRendering: "crisp-edges" }}
                        />
                    </Link>
                    <button
                        type="button"
                        onClick={closeMenu}
                        className="rounded-md p-2 text-black hover:bg-gray-100"
                        aria-label="Închide meniul"
                    >
                        <X className="h-7 w-7" />
                    </button>
                </div>

                <nav className="h-[calc(100%-4rem)] overflow-y-auto px-6 py-8 text-3xl font-bold text-black">
                    <Link href="/prezentare" onClick={closeMenu} className="block py-1">
                        Prezentare
                    </Link>

                    <button
                        type="button"
                        className="block w-full py-1 text-left"
                        onClick={() => toggleSection("management")}
                    >
                        Management
                    </button>
                    <div
                        className={`overflow-hidden text-xl font-bold transition-[max-height] duration-300 ${
                            expandedSection === "management" ? "max-h-60" : "max-h-0"
                        }`}
                    >
                        <div className="space-y-1 pb-2 pl-3">
                            <Link href="/management-documente" onClick={closeMenu} className="block">
                                Documente
                            </Link>
                            <Link href="/conducere" onClick={closeMenu} className="block">
                                Conducere
                            </Link>
                            <Link href="/consiliu-de-administratie" onClick={closeMenu} className="block">
                                Consiliu de Administratie
                            </Link>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="block w-full py-1 text-left"
                        onClick={() => toggleSection("elevi")}
                    >
                        Elevi
                    </button>
                    <div
                        className={`overflow-hidden text-xl font-bold transition-[max-height] duration-300 ${
                            expandedSection === "elevi" ? "max-h-60" : "max-h-0"
                        }`}
                    >
                        <div className="space-y-1 pb-2 pl-3">
                            <Link href="/elevi-documente" onClick={closeMenu} className="block">
                                Documente
                            </Link>
                            {navbarLinks.orar && (
                                <a
                                    href={navbarLinks.orar}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={closeMenu}
                                    className="block"
                                >
                                    Orar
                                </a>
                            )}
                            <Link href="/premii" onClick={closeMenu} className="block">
                                Premii
                            </Link>
                            <Link href="/cjex-salaj" onClick={closeMenu} className="block">
                                CJEX Sălaj
                            </Link>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="block w-full py-1 text-left"
                        onClick={() => toggleSection("profesori")}
                    >
                        Profesori
                    </button>
                    <div
                        className={`overflow-hidden text-xl font-bold transition-[max-height] duration-300 ${
                            expandedSection === "profesori" ? "max-h-72" : "max-h-0"
                        }`}
                    >
                        <div className="space-y-1 pb-2 pl-3">
                            <Link href="/profesori-documente" onClick={closeMenu} className="block">
                                Documente
                            </Link>
                            <Link href="/consiliu-profesoral" onClick={closeMenu} className="block">
                                Consiliu Profesoral
                            </Link>
                            <Link href="/catedre" onClick={closeMenu} className="block">
                                Catedre
                            </Link>
                            <Link href="/diriginti" onClick={closeMenu} className="block">
                                Diriginti
                            </Link>
                        </div>
                    </div>

                    <Link href="/examene" onClick={closeMenu} className="block py-1">
                        Examene
                    </Link>
                    <Link href="/proiecte" onClick={closeMenu} className="block py-1">
                        Proiecte
                    </Link>
                    <Link href="/contact" onClick={closeMenu} className="block py-1">
                        Contact
                    </Link>

                    <SocialLinks className="mt-8 gap-4" iconClassName="h-10 w-10" />

                    <div className="mt-6 flex items-center gap-3">
                        <Image
                            className="h-5 w-8 rounded-md border shadow"
                            src="/websiteUI/flag_of_romania.webp"
                            alt="ro_flag"
                            width={32}
                            height={20}
                        />
                        <a href="https://cnszalau.ro/hu/" onClick={closeMenu}>
                            <Image
                                className="h-5 w-8 rounded-md border shadow"
                                src="/websiteUI/Flag-Hungary.png"
                                alt="hu_flag"
                                width={32}
                                height={20}
                            />
                        </a>
                    </div>
                </nav>
            </div>,
            document.body
        );

    return (
        <>
            <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-gray-200 bg-brand-cream">
                <div className="relative flex w-full items-center p-4">
                    <div className="hidden flex-1 lg:block" aria-hidden="true" />
                    <div className="flex items-center lg:justify-center">
                        <Link href="/" onClick={closeMenu} className="z-50 shrink-0">
                            <Image
                                src="/websiteUI/logo.png"
                                alt="Logo"
                                width={64}
                                height={64}
                                className="-mb-2 mr-5 min-w-10 w-4 p-0"
                                style={{ imageRendering: "crisp-edges" }}
                            />
                        </Link>
                        <div className="hidden lg:flex">
                            <NavbarButton title="PREZENTARE" link="/prezentare" />
                            <NavbarButton title="MANAGEMENT" options={managementOptions} />
                            <NavbarButton title="ELEVI" options={eleviOptions} />
                            <NavbarButton title="PROFESORI" options={profesoriOptions} />
                            <NavbarButton title="EXAMENE" link="/examene" />
                            <NavbarButton title="PROIECTE" link="/proiecte" />
                            <NavbarButton title="CONTACT" link="/contact" />
                        </div>
                    </div>

                    <div className="ml-auto flex flex-1 items-center justify-end">
                        <SocialLinks
                            className="mr-2 mt-1.5 hidden gap-1 lg:flex xl:gap-1.5"
                            iconClassName="h-5 w-5 xl:h-6 xl:w-6"
                        />
                        <div className="hidden items-center lg:flex">
                            <div className="group relative ml-auto flex items-center">
                                <Image
                                    className="mr-2 mt-1.5 h-5 w-8 cursor-pointer rounded-md shadow"
                                    src="/websiteUI/Accessibility%20Icon_final.svg"
                                    alt="accessibility_icon"
                                    width={32}
                                    height={20}
                                />
                                <div className="absolute right-0 top-[27px] hidden translate-x-full flex-col rounded-xl border-2 border-gray-200 bg-brand-paper p-1 opacity-0 shadow-lg transition-all duration-75 group-hover:flex group-hover:translate-x-0 group-hover:opacity-100">
                                    <Button
                                        onClick={zoomIn}
                                        className="h-7 cursor-pointer whitespace-nowrap rounded-md bg-brand-paper text-xl font-bold text-black hover:bg-gray-100"
                                    >
                                        Mareste Text
                                    </Button>
                                    <Button
                                        onClick={zoomOut}
                                        className="h-7 cursor-pointer whitespace-nowrap rounded-md bg-brand-paper text-xl font-bold text-black hover:bg-gray-100"
                                    >
                                        Micsoreaza Text
                                    </Button>
                                </div>
                            </div>
                            <div className="group relative flex items-center">
                                <Image
                                    className="z-30 ml-2 mr-2 mt-1.5 h-5 w-8 cursor-pointer rounded-md border shadow"
                                    src="/websiteUI/flag_of_romania.webp"
                                    alt="ro_flag"
                                    width={32}
                                    height={20}
                                />
                                <div className="absolute top-3 z-10 ml-2 hidden h-10 translate-x-full flex-col rounded-md bg-brand-paper opacity-0 shadow-lg transition-all duration-75 group-hover:flex group-hover:translate-x-0 group-hover:opacity-100">
                                    <a href="https://cnszalau.ro/hu/" className="mt-auto">
                                        <Image
                                            className="h-5 w-8 cursor-pointer rounded-md border shadow"
                                            src="/websiteUI/Flag-Hungary.png"
                                            alt="hu_flag"
                                            width={32}
                                            height={20}
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="rounded-md p-2 text-black hover:bg-gray-100 lg:hidden"
                            onClick={() => setIsMenuOpen(true)}
                            aria-label="Deschide meniul"
                            aria-expanded={isMenuOpen}
                        >
                            <Menu className="h-7 w-7" />
                        </button>
                    </div>
                </div>
            </header>
            {mobileMenu}
        </>
    );
};

export default Navbar;
