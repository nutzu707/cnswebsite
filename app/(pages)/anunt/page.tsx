"use client"

import PageBody from "@/app/components/pagebody/pagebody";
import NewsArticleDisplay from "@/app/components/newsarticledisplay/newsarticledisplay";
import React from "react";
import { useSearchParams } from 'next/navigation'
import {Suspense} from "react";

function Asd(){

    const searchParams = useSearchParams();
    const id = searchParams.get('id') || "";
    return (
        <NewsArticleDisplay anunt={id} />
    );
}


export default function Anunt() {
    return (
        <Suspense>
            <div>
                <PageBody>
                    <Suspense>
                        <Asd/>
                    </Suspense>
                </PageBody>
            </div>
        </Suspense>
    );
}