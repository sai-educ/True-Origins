"use client";

import Navbar from '../components/Navbar';
import { ArrowRight, Shield, Lock, Eye, Globe, Building2, Users, FileSearch, Fingerprint } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 border-b border-slate-100">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm font-semibold text-slate-600 mb-8 tracking-wide uppercase">
            <Shield className="w-4 h-4" />
            Truth Analysis Agency based on C2PA Standards
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-tight">
            How do you know if a file is <br />
            <span className="text-slate-400">human-crafted</span> or <span className="text-slate-900">AI-generated</span>?
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            We trace the origin of media to combat misinformation. <br />
            We provide exhaustive, real-human verified C2PA reports on suspicious files.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/verify" className="px-10 py-5 bg-slate-900 text-white rounded-lg font-bold text-lg hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl shadow-slate-900/20 transform hover:scale-105">
              Submit a File for Assessment <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Comprehensive Truth Analysis</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We deploy advanced AI-powered solutions to identify and mitigate digital threats across sectors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* CSAM */}
            <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Fingerprint className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">CSAM Detection</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Combatting Exploitation</p>
              <p className="text-slate-600 leading-relaxed mb-8">
                As digital spaces expand, the spread of Child Sexual Abuse Material (CSAM) demands urgent action.
                We provide advanced AI solutions to identify and combat CSAM, protecting children and upholding digital safety.
              </p>
              <Link href="/verify" className="inline-flex items-center gap-2 text-slate-900 font-bold hover:gap-3 transition-all">
                Read more <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Deepfakes */}
            <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Deepfake Analysis</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Demystifying Deception</p>
              <p className="text-slate-600 leading-relaxed mb-8">
                In an era where deepfakes mimic reality, distinguishing truth is crucial.
                TrueOrigins equips you with sophisticated tools to unmask digital deceptions, ensuring you stay ahead in the battle for authenticity.
              </p>
              <Link href="/verify" className="inline-flex items-center gap-2 text-slate-900 font-bold hover:gap-3 transition-all">
                Our services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Cybersecurity */}
            <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Cybersecurity</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Bolstering Defenses</p>
              <p className="text-slate-600 leading-relaxed mb-8">
                The threat of cyber attacks poses serious risks to security.
                We offer powerful AI solutions to detect and prevent these threats, fortifying our digital world and safeguarding the future.
              </p>
              <Link href="/verify" className="inline-flex items-center gap-2 text-slate-900 font-bold hover:gap-3 transition-all">
                See our report <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* National Security */}
            <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">National Security</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Government Solutions</p>
              <p className="text-slate-600 leading-relaxed mb-8">
                We offer crucial services to governmental organizations, deploying sophisticated analysis to identify and mitigate digital threats.
                Our detailed reports guide national security efforts.
              </p>
              <Link href="/verify" className="inline-flex items-center gap-2 text-slate-900 font-bold hover:gap-3 transition-all">
                Our NDA-services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Media Authenticity */}
            <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <FileSearch className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Media Verification</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Trust & Credibility</p>
              <p className="text-slate-600 leading-relaxed mb-8">
                We deliver a vital service to content creators and consumers.
                Our team expertly applies advanced verification techniques to certify authenticity, supplying detailed reports to uphold trust.
              </p>
              <Link href="/verify" className="inline-flex items-center gap-2 text-slate-900 font-bold hover:gap-3 transition-all">
                Items on our report <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Corporate Cybersecurity */}
            <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Corporate Security</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Enterprise Protection</p>
              <p className="text-slate-600 leading-relaxed mb-8">
                We safeguard crucial business data by analyzing vulnerabilities and running security checks.
                Our thorough reports ensure robust protection of your enterprise's digital assets.
              </p>
              <Link href="/verify" className="inline-flex items-center gap-2 text-slate-900 font-bold hover:gap-3 transition-all">
                See Corporate clients <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Public Digital Safety */}
            <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group md:col-span-2 lg:col-span-3">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Public Digital Safety Assurance</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Society-Wide Impact</p>
                  <p className="text-slate-600 leading-relaxed mb-8 max-w-4xl">
                    Amid the burgeoning digital landscape, we provide a crucial service to the general public, applying advanced analysis techniques to evaluate the authenticity of online content.
                    By detecting artificially generated materials, we provide the public with in-depth reports, fostering trust and safety in the digital world.
                  </p>
                  <Link href="/verify" className="inline-flex items-center gap-2 text-slate-900 font-bold hover:gap-3 transition-all">
                    Our report, in society <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold mb-8">Interested in Our Services?</h2>
          <p className="text-xl text-slate-300 mb-12 leading-relaxed">
            Navigating the digital world can be complex, but you don't have to do it alone.
            Whether you're a governmental organization, a corporate entity, or an individual, TrueOrigins Analytics is here to help.
            Get in touch today and let us guide you towards a safer, more authentic digital future.
          </p>
          <Link href="/verify" className="px-12 py-6 bg-white text-slate-900 rounded-lg font-bold text-xl hover:bg-slate-100 transition-all inline-flex items-center gap-3">
            Get a Report <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <div className="mb-4 md:mb-0 font-semibold">
            © TrueOrigins AI. All rights reserved.
          </div>
          <div className="flex gap-8">
            <Link href="/mission" className="hover:text-slate-900 transition-colors">Mission</Link>
            <Link href="/technology" className="hover:text-slate-900 transition-colors">Technology</Link>
            <Link href="/verify" className="hover:text-slate-900 transition-colors">Services</Link>
            <Link href="/verify" className="hover:text-slate-900 transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
