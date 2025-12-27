"use client"

import React from 'react';
import NavbarButton from "@/app/components/navbarbutton/navbarbutton";
import {Button} from "@/components/ui/button";
import { useState, useEffect  } from "react";

const Navbar: React.FC = () => {
    const [navbarLinks, setNavbarLinks] = useState({
        orar: "/assets/uploads/documents/websitedocs/orar_clase_2024-2025.pdf",
        premii: "/assets/uploads/documents/websitedocs/rezultate-cns.pdf"
    });

    useEffect(() => {
        const fetchNavbarConfig = async () => {
            try {
                const response = await fetch('/assets/uploads/documents/websitedocs/navbar-config.json');
                if (response.ok) {
                    const data = await response.json();
                    setNavbarLinks(data);
                }
            } catch (error) {
                console.error('Error loading navbar config:', error);
                // Keep default values if config doesn't exist
            }
        };
        fetchNavbarConfig();
    }, []);

    const managementOptions = [
        { title: "Documente", link: "/management-documente" },
        { title: "Conducere", link: "/conducere" },
        { title: "Consiliu de Administratie", link: "/consiliu-de-administratie" },
        { title: "Arhiva Foto", link: "/arhiva-foto" },

    ];
    const eleviOptions = [
        { title: "Documente", link: "/elevi-documente" },
        { title: "Orar", link: navbarLinks.orar },
        { title: "Premii", link: navbarLinks.premii },
        { title: "CJEX Sălaj", link: "/cjex-salaj" },


    ];
    const profesoriOptions = [
        { title: "Documente", link: "/profesori-documente" },
        { title: "Consiliu Profesoral", link: "/consiliu-profesoral" },
        { title: "Catedre", link: "/catedre" },
        { title: "Diriginti", link: "/diriginti" },

    ];
    var zoomlvl = 100;

    function zoomIn() {
        if(zoomlvl<150)
        zoomlvl += 10;
        document.body.style.zoom = zoomlvl + "%";
    }

    function zoomOut() {
        if(zoomlvl>100)
        zoomlvl -= 10;
        document.body.style.zoom = zoomlvl + "%";
    }



    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen((prevState) => !prevState);
    };


    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setExpandedSection((prev) => (prev === section ? null : section));
    };





    return (
        <div className="p-4 border-b-[#E5E7EB] border-solid border-b-2 flex fixed bg-white w-full items-center z-10 ">

    
          
            
            <div className=" w-full lg:justify-center items-center flex">
                <div className="z-50 ">
                    <a href="/">
                        <img
                            src="/websiteUI/logo.png"
                            alt="Logo"
                            className="min-w-10 w-4 p-0 mr-5 -mb-2"
                            style={{ imageRendering: 'crisp-edges' }}
                        />

                    </a>
                </div>
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

          
            <div className="hidden lg:flex items-center absolute right-4">

        
                <div className="ml-auto flex items-center relative group ">
                    <img
                        className="w-8 h-5 shadow-2xl rounded-md mt-1.5 ml-2 mr-2 cursor-pointer"
                        src="/websiteUI/Accessibility%20Icon_final.svg"
                        alt="accessibility_icon"
                    />
                    
                    <div className="absolute top-[27px] right-0 bg-white  hidden group-hover:flex flex-col  shadow-lg p-1 rounded-xl border-2 transition-all duration-75 ease-out transform opacity-0 translate-x-full group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-y-100">
                        <Button onClick={zoomIn} className="h-7 bg-white text-black hover:bg-gray-100 cursor-pointer font-bold text-xl rounded-md whitespace-nowrap">
                            Mareste Text
                        </Button>
                        <Button onClick={zoomOut} className="h-7 bg-white text-black hover:bg-gray-100 cursor-pointer font-bold text-xl rounded-md whitespace-nowrap">
                            Micsoreaza Text
                        </Button>
                        <Button className="h-7 bg-white text-black hover:bg-gray-100 cursor-pointer font-bold text-xl rounded-md whitespace-nowrap hidden">
                            Contrast
                        </Button>
                    </div>
                    


                </div>
                <div className="flex items-center relative group bg-none">
                    <img
                        className="w-8 h-5 shadow-2xl rounded-md mt-1.5 ml-2 z-30 b mr-2 cursor-pointer border"
                        src="/websiteUI/flag_of_romania.webp"
                        alt="ro_flag"
                    />
                    <div className="absolute top-3  ml-2 h-10 rounded-md hidden z-10 bg-[#FBFBFB] group-hover:flex flex-col  shadow-lg transition-all duration-75 ease-out transform opacity-0 translate-x-full group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-y-100">
                        <a href="https://cnszalau.ro/hu/" className="mt-auto ">
                        <img
                            className="cursor-pointer w-8 h-5 shadow-2xl rounded-md border "
                            src="/websiteUI/Flag-Hungary.png"
                            alt="hu_flag"
                        />
                        </a>
                    </div>
                </div>

            </div>
           
            <div className="flex lg:hidden mr-0 ml-auto ">
                <button
                    className={`transition-transform duration-300 ease-in-out ${
                        isMenuOpen ? "rotate-90" : "rotate-0"
                    }`}
                    onClick={toggleMenu}
                    style={{ zIndex: 999 }} // Ensure it stays on top of other content
                >
                    <img src="/websiteUI/burger-menu-icon.svg" alt="BurgerIcon" />
                </button>
                <div
                    className={`fixed top-0 left-0 w-full flex h-full z-10 bg-white transition-all duration-500 transform ${
                        isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-100"
                    }`}
                >
                    <div className="content-center ml-8 text-3xl font-bold h-full">
                       <a href="/prezentare"><p>Prezentare</p></a>

                        <p
                            className="cursor-pointer"
                            onClick={() => toggleSection("management")}
                        >
                            Management
                        </p>
                        <div
                            className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                                expandedSection === "management" ? "max-h-[500px]" : "max-h-0"
                            }`}
                        >
                            <div className="text-xl">
                               <a href="/management-documente"><p>Documente</p></a>
                               <a href="/conducere"><p>Conducere</p></a>
                               <a href="/consiliu-de-administratie"><p>Consiliu de Administratie</p></a>
                               <a href="/arhiva-foto"><p>Arhiva Foto</p></a>
                            </div>
                        </div>

                        <p
                            className="cursor-pointer"
                            onClick={() => toggleSection("elevi")}
                        >
                            Elevi
                        </p>
                        <div
                            className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                                expandedSection === "elevi" ? "max-h-[500px]" : "max-h-0"
                            }`}
                        >
                            <div className="text-xl">
                                <a href="/elevi-documente"><p>Documente</p></a>
                                <a href={navbarLinks.orar}><p>Orar</p></a>
                                <a href={navbarLinks.premii}><p>Premii</p></a>
                                <a href="/cjex-salaj"><p>CJEX Sălaj</p></a>
                            </div>
                        </div>

                        <p
                            className="cursor-pointer"
                            onClick={() => toggleSection("profesori")}
                        >
                            Profesori
                        </p>
                        <div
                            className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                                expandedSection === "profesori" ? "max-h-[500px]" : "max-h-0"
                            }`}
                        >
                            <div className="text-xl">
                                <a href="/profesori-documente"><p>Documente</p></a>
                                <a href="/consiliu-profesoral"><p>Consiliu Profesoral</p></a>
                                <a href="/catedre"><p>Catedre</p></a>
                                <a href="/diriginti"><p>Diriginti</p></a>
                            </div>
                        </div>

                        <a href="/examene"><p>Examene</p></a>
                        <a href="/proiecte"><p>Proiecte</p></a>
                        <a href="/contact"><p>Contact</p></a>




                        <div className="flex mt-2">

                        <img
                            className="cursor-pointer w-8 h-5 shadow-2xl rounded-md border "
                            onClick={() => toggleSection("steag")}
                            src="/websiteUI/flag_of_romania.webp"
                            alt="ro_flag"
                        />

                        <a href="https://cnszalau.ro/hu/">
                        <div
                            className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                                expandedSection === "steag" ? "max-h-[500px]" : "max-h-0"
                            }`}
                        >
                            <img
                                className="cursor-pointer w-8 h-5 shadow-2xl rounded-md border ml-2 "
                                src="/websiteUI/Flag-Hungary.png"
                                alt="hu_flag"
                            />
                        </div>
                        </a>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Navbar;
