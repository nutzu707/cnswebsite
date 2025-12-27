"use client";

import { ArrowDownSquare, ArrowUpSquare } from "lucide-react";
import { useState } from "react";

interface FaqItemProps {
  title: string;
  content: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className="cursor-pointer flex items-center" onClick={handleToggle}>
      <p className="text-2xl font-bold pt-1 -mb-1">{title}</p>
      <span className="ml-auto mt-2 text-indigo-900 transition-transform duration-200">
          {isOpen ? <ArrowUpSquare /> : <ArrowDownSquare />}
        </span>
      </div>

      <div
        className={`transition-all duration-200 overflow-hidden ${
          isOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-xl">{content}</p>
      </div>

      <hr className="border-t-2 mt-2" />
    </div>
  );
};

export default FaqItem;
