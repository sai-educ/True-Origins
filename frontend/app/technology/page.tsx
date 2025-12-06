import Navbar from '../../components/Navbar';
import { Shield, Database, Cpu, Network, FileSearch, Lock } from 'lucide-react';

export default function TechnologyPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <Navbar />

            <main className="pt-20 pb-24">
                {/* Header */}
                <section className="px-6 mb-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                            Algorithmic Verification Framework
                        </h1>
                        <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-light">
                            A systematic approach to assessing emerging generative technologies through
                            cryptographic provenance, metadata forensics, and heuristic analysis.
                        </p>
                    </div>
                </section>

                {/* Methodology Section */}
                <section className="px-6 mb-24">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Methodology</h2>
                                <p className="text-slate-600 leading-relaxed mb-6 text-justify">
                                    Our verification pipeline employs a multi-modal assessment strategy designed to interrogate
                                    digital assets at the structural, metadata, and pixel levels. By integrating the
                                    Coalition for Content Provenance and Authenticity (C2PA) standards with proprietary
                                    forensic algorithms, we establish a deterministic probability of synthetic origin.
                                </p>
                                <p className="text-slate-600 leading-relaxed text-justify">
                                    This framework is designed to be adaptive, evolving alongside the rapid advancements
                                    in generative adversarial networks (GANs) and diffusion models, ensuring robust
                                    detection capabilities against state-of-the-art synthesis techniques.
                                </p>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">Assessment Vectors</h3>
                                <ul className="space-y-4">
                                    <li className="flex gap-4">
                                        <Database className="w-6 h-6 text-slate-700 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-slate-900">Provenance Layer</h4>
                                            <p className="text-sm text-slate-600">Cryptographic validation of chain-of-custody assertions via C2PA/CAI specifications.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <FileSearch className="w-6 h-6 text-slate-700 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-slate-900">Metadata Forensics</h4>
                                            <p className="text-sm text-slate-600">Analysis of EXIF/XMP inconsistencies, software signatures, and quantization tables.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <Cpu className="w-6 h-6 text-slate-700 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-slate-900">Heuristic Detection</h4>
                                            <p className="text-sm text-slate-600">Pattern recognition of generative artifacts and naming conventions specific to AI models.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* System Architecture */}
                <section className="px-6 py-24 bg-slate-50 border-y border-slate-200">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">System Architecture</h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
                                <div className="mb-6 text-slate-900">
                                    <Network className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">1. Ingestion & Normalization</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    Incoming assets undergo strict sanitization and format normalization.
                                    Cryptographic hashes (SHA-256) are generated to establish a unique identifier
                                    for the analysis session, ensuring data integrity throughout the pipeline.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
                                <div className="mb-6 text-slate-900">
                                    <Lock className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">2. Cryptographic Verification</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    The system queries the asset's manifest store for C2PA assertions.
                                    Digital signatures are validated against a trusted root certificate authority (CA) list
                                    to confirm the identity of the signing entity (e.g., camera hardware, editing software).
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
                                <div className="mb-6 text-slate-900">
                                    <Cpu className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">3. Inference & Scoring</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    Extracted features are fed into a weighted scoring engine.
                                    The engine aggregates signals from metadata analysis, provenance checks, and
                                    heuristic matching to compute a final synthetic probability score with a defined confidence interval.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Emerging Tech Assessment */}
                <section className="px-6 py-24">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8">Assessing Emerging Technologies</h2>
                        <div className="prose prose-lg text-slate-600 text-justify">
                            <p>
                                The landscape of generative AI is characterized by rapid iteration.
                                Traditional detection methods based solely on visual artifacts are becoming increasingly
                                unreliable as models improve. TrueOrigins adopts a <strong>provenance-first approach</strong>.
                            </p>
                            <p>
                                Rather than playing a cat-and-mouse game with pixel-level detection, we focus on the
                                immutable history of the file. By advocating for and implementing the C2PA standard,
                                we provide a systematic method to verify authenticity that scales with technology.
                                As new generative models emerge, our framework assesses them not just by what they produce,
                                but by the digital footprints they leave—or fail to leave—in the file's metadata structure.
                            </p>
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
