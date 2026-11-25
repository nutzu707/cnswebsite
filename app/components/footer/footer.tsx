'use client';

import React from "react";

const Footer = () => {
    const currentYear = new Date().getFullYear();



    return (
        <div className="pb-16 lg:pt-32 pt-16">
            <hr className="solid border-t-2 border-gray-200" />

            <p className="pt-5 text-center text-gray-700">©{currentYear} Colegiul Național &quot;Silvania&quot;</p>
            <p className="-mt-1 text-center text-sm text-gray-600">Designed and Developed by Ionut Sandor</p>

        </div>
    );
};

export default Footer;
