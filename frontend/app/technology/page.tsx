import Navbar from '../../components/Navbar';
import { Shield, CheckCircle, Loader2, FileCode, Lock, Server } from 'lucide-react';

export default function TechnologyPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <Navbar />

            <main className="pt-20 pb-24">
                {/* Hero */}
                <section className="px-6 mb-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl font-extrabold text-slate-900 mb-8 tracking-tight leading-tight">
                            Forensic Precision. <br /> Cryptographic Certainty.
                        </h1>
                        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                            Our multi-layered verification engine combines the C2PA open standard with
                            advanced metadata forensics and AI-driven heuristics to deliver
                            definitive authenticity assessments.
                        </p>
                    </div>
                </section>

                {/* Architecture Diagram / Explanation */}
                <section className="px-6 bg-slate-900 text-white py-24">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold mb-16 text-center">The Verification Pipeline</h2>

                        <div className="grid md:grid-cols-4 gap-8 relative">
                            {/* Connecting Line (Desktop) */}
                            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-slate-700 -z-10 transform -translate-y-1/2"></div>

                            {/* Step 1 */}
                            <div className="relative">
                                <div className="w-24 h-24 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center mb-8 mx-auto z-10">
                                    <FileCode className="w-10 h-10 text-purple-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-center">1. Ingestion</h3>
                                <p className="text-slate-400 text-sm text-center leading-relaxed">
                                    Secure upload and hashing of the digital asset. We support images, videos, and PDFs.
                                    Files are processed in a secure, ephemeral environment.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="relative">
                                <div className="w-24 h-24 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center mb-8 mx-auto z-10">
                                    <Shield className="w-10 h-10 text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-center">2. C2PA Validation</h3>
                                <p className="text-slate-400 text-sm text-center leading-relaxed">
                                    We verify cryptographic signatures against the C2PA trust list. This confirms if the
                                    file's provenance data has been tampered with since creation.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="relative">
                                <div className="w-24 h-24 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center mb-8 mx-auto z-10">
                                    <Server className="w-10 h-10 text-pink-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-center">3. Deep Forensics</h3>
                                <p className="text-slate-400 text-sm text-center leading-relaxed">
                                    Extraction of EXIF, XMP, and structural metadata. We analyze software signatures,
                                    compression artifacts, and quantization tables for anomalies.
                                </p>
                            </div>

                            {/* Step 4 */}
                            <div className="relative">
                                <div className="w-24 h-24 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center mb-8 mx-auto z-10">
                                    <CheckCircle className="w-10 h-10 text-green-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-center">4. Scoring & Report</h3>
                                <p className="text-slate-400 text-sm text-center leading-relaxed">
                                    A weighted scoring engine synthesizes all signals into a final probability score
                                    and generates a detailed, immutable verification report.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Detailed Tech Specs */}
                <section className="px-6 py-24">
                    <div className="max-w-4xl mx-auto">
                        <div className="space-y-16">
                            <div className="flex gap-8">
                                <div className="flex-shrink-0 mt-1">
                                    <Shield className="w-8 h-8 text-slate-900" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">C2PA Standard Implementation</h3>
                                    <p className="text-slate-600 leading-relaxed mb-4">
                                        The Coalition for Content Provenance and Authenticity (C2PA) standard is the gold standard for
                                        digital provenance. TrueOrigins implements the full C2PA specification, allowing us to:
                                    </p>
                                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                                        <li>Verify digital signatures from hardware (cameras) and software (editing tools).</li>
                                        <li>Detect if provenance data has been stripped or altered.</li>
                                        <li>Display the full "chain of custody" for an asset.</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex gap-8">
                                <div className="flex-shrink-0 mt-1">
                                    <Loader2 className="w-8 h-8 text-slate-900" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Heuristic Pattern Matching</h3>
                                    <p className="text-slate-600 leading-relaxed mb-4">
                                        AI generators often leave subtle fingerprints. Our heuristic engine scans for:
                                    </p>
                                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                                        <li>Specific naming conventions used by tools like Midjourney, DALL-E, and Stable Diffusion.</li>
                                        <li>Metadata tags injected by generative models.</li>
                                        <li>Inconsistencies between file headers and content.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-12 px-6 bg-white border-t border-slate-200">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <Shield className="w-5 h-5 text-slate-900" />
                        <span className="font-semibold text-slate-900">TrueOrigins</span>
                    </div>
                    <div className="mt-4 md:mt-0">
                        © 2024 TrueOrigins Inc.
                    </div>
                </div>
            </footer>
        </div>
    );
}
