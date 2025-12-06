"use client";

import Navbar from '../components/Navbar';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-tight">
            Establish Trust in a <br />
            Synthetic World.
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            The enterprise standard for digital media authentication.
            Distinguish human creativity from AI generation with forensic precision.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/verify" className="px-10 py-5 bg-slate-900 text-white rounded-lg font-bold text-lg hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl shadow-slate-900/20 transform hover:scale-105">
              Start Verification <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/mission" className="px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-lg font-bold text-lg hover:bg-slate-50 transition-all">
              Our Mission
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 border-y border-slate-100 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-10">
            Built on Global Open Standards
          </p>
          <div className="flex justify-center gap-16 opacity-50 grayscale">
            <span className="text-2xl font-black text-slate-400">C2PA</span>
            <span className="text-2xl font-black text-slate-400">CAI</span>
            <span className="text-2xl font-black text-slate-400">IPTC</span>
            <span className="text-2xl font-black text-slate-400">W3C</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <div className="mb-4 md:mb-0">
            © 2024 TrueOrigins Inc.
          </div>
          <div className="flex gap-8">
            <Link href="/mission" className="hover:text-slate-900">Mission</Link>
            <Link href="/technology" className="hover:text-slate-900">Technology</Link>
            <Link href="/verify" className="hover:text-slate-900">Verify</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
