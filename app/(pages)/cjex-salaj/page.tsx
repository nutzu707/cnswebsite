"use client";

import PageTitle from "@/app/components/pagetitle/pagetitle";
import PageBody from "@/app/components/pagebody/pagebody";
import DocumentsListBlobPublic from "@/app/components/displaydocumentsblob-public/displaydocumentsblob-public";
import React from "react";
import Footer from "@/app/components/footer/footer";

export default function CJEXSalaj() {
    return (
        <div>
            <PageBody>
                <PageTitle text="CJEX Sălaj"></PageTitle>
                <div className="lg:w-[1000px] w-full self-center mt-16 lg:mt-24 shadow-lg bg-white p-6 lg:p-8 rounded-2xl border-2 border-gray-200">
                    <DocumentsListBlobPublic folder="documents/cjex-salaj" />
                </div>
                <Footer/>

            </PageBody>

        </div>
    );
}
