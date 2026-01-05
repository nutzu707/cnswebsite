'use client';

import React from "react";

const PageBody = ({children}) => {

    return (
        <div className="mx-auto w-full max-w-[1400px] px-8 flex flex-col overflow-hidden">
            {children}
        </div>
    );
};

export default PageBody;
