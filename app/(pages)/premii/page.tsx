"use client";

import PageTitle from "@/app/components/pagetitle/pagetitle";
import PageBody from "@/app/components/pagebody/pagebody";
import DocumentsListBlobPublic from "@/app/components/displaydocumentsblob-public/displaydocumentsblob-public";
import React from "react";
import Footer from "@/app/components/footer/footer";

/** Previous school-year results (before 2025-2026), still hosted under navbar-links. */
const PREVIOUS_PREMII_DOCS = [
    {
        filename: "REZULTATE CNS 2024-2025.pdf",
        url: "https://pub-97f425aa83804827b2f14fe49afa1f7a.r2.dev/navbar-links/rezultate-cns.pdf",
        uploadedAt: "2026-01-04T11:36:40.337Z",
        size: 183569,
        pathname: "navbar-links/rezultate-cns.pdf",
    },
];

export default function Premii() {
    return (
        <div>
            <PageBody>
                <PageTitle text="PREMII"></PageTitle>
                <div className="lg:w-[1000px] w-full self-center mt-16 lg:mt-24 shadow-lg bg-brand-paper p-6 lg:p-8 rounded-2xl border-2 border-gray-200">
                    <DocumentsListBlobPublic
                        folder="documents/premii"
                        extraFiles={PREVIOUS_PREMII_DOCS}
                    />
                </div>
                <Footer />
            </PageBody>
        </div>
    );
}
