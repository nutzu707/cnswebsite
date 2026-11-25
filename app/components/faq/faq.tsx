"use client";

import { ArrowDownSquare, ArrowUpSquare, ExternalLink, FileText } from "lucide-react";
import { useState } from "react";

interface FaqItemProps {
  title: string;
  content?: string;
  documentUrl?: string;
  documentName?: string;
}

const FaqItem: React.FC<FaqItemProps> = ({
  title,
  content,
  documentUrl,
  documentName,
}) => {
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
        className={`grid transition-[grid-template-rows,opacity,margin] duration-200 ${
          isOpen ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden min-h-0">
          {documentUrl ? (
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 bg-brand-paper hover:border-indigo-900 hover:shadow-md transition-all duration-300"
            >
              <div className="bg-indigo-50 p-2 rounded-lg group-hover:bg-indigo-900 transition-colors duration-300">
                <FileText className="w-6 h-6 text-indigo-900 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="break-words text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-indigo-900 lg:text-xl">
                  {documentName ?? "Deschide documentul"}
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-indigo-900 flex-shrink-0 transition-all duration-300 group-hover:scale-110" />
            </a>
          ) : (
            <p className="text-xl">{content}</p>
          )}
        </div>
      </div>

      <hr className="mt-2 border-t-2 border-gray-200" />
    </div>
  );
};

export default FaqItem;
