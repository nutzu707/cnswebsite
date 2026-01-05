import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/app/components/navbar/navbar";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"


import './globals.css'





export const metadata: Metadata = {
    title: 'Colegiul National "SILVANIA"',
    description: "",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" type="image/x-icon" href="/websiteUI/logo.png" />
        </head>
        <body>
        <Navbar/>
        {children}
        </body>
        </html>
    );
}
