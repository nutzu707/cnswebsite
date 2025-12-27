"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageBody from "@/app/components/pagebody/pagebody";
import PageTitle from "@/app/components/pagetitle/pagetitle";
import Footer from "@/app/components/footer/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (data.success) {
                router.push("/dashboard");
                router.refresh();
            } else {
                setError(data.error || "Invalid password");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageBody>
                <PageTitle text={"LOG IN"} />
                <div className="flex justify-center mt-32">
                    <form onSubmit={handleSubmit} className="space-y-8 lg:w-[500px] self-center">
                        {error && (
                            <div className="text-red-500 text-center font-bold">{error}</div>
                        )}
                        <Input
                            type="password"
                            placeholder="PAROLA"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="off"
                            className="w-full"
                            required
                        />
                        <Button
                            type="submit"
                            disabled={loading}
                            className="text-xl rounded-md shadow-xl bg-indigo-900 text-white border-2 border-solid hover:bg-indigo-950 font-bold w-full"
                        >
                            {loading ? "LOGGING IN..." : "LOG IN"}
                        </Button>
                    </form>
                </div>
                <div className="mt-10"></div>
            </PageBody>
        </div>
    );
}

