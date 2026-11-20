"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
    compact?: boolean;
}

export default function LogoutButton({ compact = false }: LogoutButtonProps) {
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

    if (compact) {
        return (
            <button
                type="button"
                onClick={handleLogout}
                title="Sign out"
                className="rounded-xl bg-red-500 p-2.5 text-white hover:bg-red-600"
            >
                <LogOut className="h-4 w-4" />
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-xl bg-red-500 px-3 py-2.5 text-sm font-bold text-white hover:bg-red-600"
        >
            Sign out
        </button>
    );
}
