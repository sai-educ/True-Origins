"use client";

import { Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 group">
                    <Shield className="w-6 h-6 text-slate-900 group-hover:text-slate-700 transition-colors" />
                    <span className="text-xl font-bold tracking-tight text-slate-900">TrueOrigins</span>
                </Link>
                <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
                    <Link
                        href="/mission"
                        className={`transition-colors ${isActive('/mission') ? 'text-slate-900 font-bold' : 'hover:text-slate-900'}`}
                    >
                        Mission
                    </Link>
                    <Link
                        href="/technology"
                        className={`transition-colors ${isActive('/technology') ? 'text-slate-900 font-bold' : 'hover:text-slate-900'}`}
                    >
                        Technology
                    </Link>
                    <Link
                        href="/verify"
                        className={`transition-colors ${isActive('/verify') ? 'text-slate-900 font-bold' : 'hover:text-slate-900'}`}
                    >
                        Verify Media
                    </Link>
                </div>
            </div>
        </nav>
    );
}
