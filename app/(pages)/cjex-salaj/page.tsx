"use client";

import PageTitle from "@/app/components/pagetitle/pagetitle";
import PageBody from "@/app/components/pagebody/pagebody";
import DocumentsListBlobPublic from "@/app/components/displaydocumentsblob-public/displaydocumentsblob-public";
import React from "react";
import Footer from "@/app/components/footer/footer";

export default function CJEXSalaj() {

    const currentYear = new Date().getFullYear();

    return (
        <div>
            <PageBody>
                <PageTitle text="CJEX Sălaj"></PageTitle>
                <div className="lg:w-[1000px] w-full self-center mt-16 lg:mt-24 shadow-2xl p-10 rounded-2xl border-2">
                    <p className="text-5xl font-bold text-indigo-900 mb-4">{currentYear}</p>
                    <DocumentsListBlobPublic folder="documents/cjex-salaj" />
                </div>
                <Footer/>

            </PageBody>

        </div>
    );
}
