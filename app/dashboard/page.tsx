import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import DashboardShell from "@/app/components/dashboardshell/dashboardshell";

export default async function Dashboard() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect("/auth/signin");
    }

    return <DashboardShell />;
}
