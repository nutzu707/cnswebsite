"use client";

import React from "react";

const PageTitle = ({ text }) => {
  return (
    <div className="flex items-center justify-center w-full pt-32 lg:pt-40">
      <div className="h-0.5 bg-[#E5E7EB] animate-growFromCenter hidden lg:block"></div>
      <h2 className="text-center text-5xl font-bold mx-5 lg:text-7xl min-w-fit uppercase animate-fadeIn duration-300">
        {text}
      </h2>
      <div className="h-0.5 bg-[#E5E7EB] animate-growFromCenter hidden lg:block"></div>
    </div>
  );
};

export default PageTitle;
