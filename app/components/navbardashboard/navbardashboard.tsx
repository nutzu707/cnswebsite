"use client"

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

const NavigationButtons = () => {
    const sections = useMemo(() => [
        { id: "management", label: "MANAGEMENT" },
        { id: "elevi", label: "ELEVI" },
        { id: "profesori", label: "PROFESORI" },
        { id: "cjex", label: "CJEX" },
        { id: "anunturi", label: "ANUNTURI" },
        { id: "proiecte", label: "PROIECTE" },
        { id: "conducere", label: "CONDUCERE" },
        { id: "consiliu", label: "CONSILIU" },
        { id: "diriginti", label: "DIRIGINTI" },
        { id: "consiliu-profesoral", label: "CONSILIU PROF" },
        { id: "navbar-links", label: "NAVBAR" },
    ], []);

    const [activeSection, setActiveSection] = useState("");

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "-50% 0px -50% 0px",
            threshold: 0,
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach((section) => {
            const element = document.getElementById(section.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            sections.forEach((section) => {
                const element = document.getElementById(section.id);
                if (element) {
                    observer.unobserve(element);
                }
            });
        };
    }, [sections]);

    const handleScroll = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = -196;
            const position = element.getBoundingClientRect().top + window.scrollY + offset;

            window.scrollTo({
                top: position,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="flex">
            {sections.map((section) => (
                <Button
                    key={section.id}
                    className={`text-black px-2 h-8 py-0.5 rounded-md flex items-center font-bold text-xl ${
                        activeSection === section.id
                            ? "bg-gray-200" 
                            : "bg-white hover:bg-gray-200" 
                    } ${activeSection === section.id ? "hover:bg-gray-300" : ""}`}
                    onClick={() => handleScroll(section.id)}
                >
                    {section.label}
                </Button>
            ))}
        </div>
    );
};

export default NavigationButtons;
