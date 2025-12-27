"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch("/api/logout", {
                method: "POST",
            });
            router.push("/auth/signin");
            router.refresh();
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <Button 
            className="text-xl ml-3 rounded-md shadow-xl bg-red-500 text-white border-2 border-solid hover:bg-red-600 font-bold" 
            variant="default" 
            type="button"
            onClick={handleLogout}
        >
            SIGN OUT
        </Button>
    );
}

