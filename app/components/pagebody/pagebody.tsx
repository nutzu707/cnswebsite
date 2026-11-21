'use client';

import React from "react";

const PageBody = ({children}) => {

    return (
        <div className="mx-auto flex w-full max-w-[1400px] flex-col overflow-x-hidden px-4 sm:px-8">
            {children}
        </div>
    );
};

export default PageBody;
