"use client";

import React from "react";

const PageTitle = ({ text }) => {
  return (
    <div className="flex w-full items-center justify-center px-2 pt-28 sm:pt-32 lg:pt-40">
      <div className="hidden h-1 min-w-0 flex-1 animate-growFromCenter rounded-full bg-indigo-900 lg:block" />
      <h2 className="max-w-full px-3 text-center text-[clamp(1.6rem,7vw,4.5rem)] font-bold uppercase leading-tight text-indigo-900 lg:shrink-0 lg:px-8">
        {text}
      </h2>
      <div className="hidden h-1 min-w-0 flex-1 animate-growFromCenter rounded-full bg-indigo-900 lg:block" />
    </div>
  );
};

export default PageTitle;
