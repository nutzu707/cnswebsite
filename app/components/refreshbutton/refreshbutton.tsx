'use client';

import { Button } from "@/components/ui/button";

export default function RefreshButton() {
    return (
        <Button className="text-xl rounded-md shadow-xl bg-white text-black border-2 border-solid hover:bg-gray-200 font-bold " onClick={() => window.location.reload()}>Refresh</Button>
    );
}
