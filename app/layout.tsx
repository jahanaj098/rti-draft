import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Kerala RTI Online Drafting Assistant",
    description: "Easily draft RTI applications for Kerala local bodies and government authorities.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <main className="min-h-screen bg-slate-50">
                    <header className="bg-primary-900 text-white py-6 shadow-lg">
                        <div className="container mx-auto px-4">
                            <h1 className="text-2xl font-bold tracking-tight">
                                Kerala RTI Drafting Assistant
                            </h1>
                            <p className="text-primary-100 text-sm mt-1">
                                Simplifying Information Access for Every Citizen
                            </p>
                        </div>
                    </header>
                    {children}
                    <footer className="bg-slate-100 py-8 mt-12 border-t border-slate-200">
                        <div className="container mx-auto px-4 text-center">
                            <p className="text-slate-500 text-sm">
                                &copy; {new Date().getFullYear()} Kerala RTI Drafting Assistant
                            </p>
                            <div className="mt-4 max-w-2xl mx-auto p-4 bg-white rounded-lg border border-slate-200 text-left">
                                <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                                    Mandatory Disclaimer
                                </h2>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    This is a citizen assistance platform. We are not affiliated with any government authority.
                                    RTI applications are generated for user submission only. The app does NOT submit RTI on behalf of the user.
                                </p>
                            </div>
                        </div>
                    </footer>
                </main>
            </body>
        </html>
    );
}
