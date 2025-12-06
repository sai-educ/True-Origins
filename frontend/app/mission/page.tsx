import Navbar from '../../components/Navbar';
import { Shield, Users, Globe, Lock } from 'lucide-react';

export default function MissionPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <Navbar />

            <main className="pt-20 pb-24">
                {/* Hero */}
                <section className="px-6 mb-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl font-extrabold text-slate-900 mb-8 tracking-tight leading-tight">
                            Defending Truth in the <br /> Digital Age.
                        </h1>
                        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                            We exist to restore trust in digital media. As synthetic content proliferates,
                            the line between reality and fabrication blurs. TrueOrigins provides the
                            infrastructure for a transparent, verifiable internet.
                        </p>
                    </div>
                </section>

                {/* Core Values */}
                <section className="px-6 bg-slate-50 py-24 border-y border-slate-100">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-12">
                            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-6">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">Uncompromising Integrity</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    We believe that the origin of content should be immutable and transparent.
                                    Our verification standards are rigorous, unbiased, and built on open protocols.
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-6">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">Human-Centric</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Technology should serve humanity, not deceive it. We empower creators,
                                    journalists, and the public to distinguish human expression from algorithmic generation.
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-6">
                                    <Globe className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">Universal Standard</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Truth is not proprietary. We champion the C2PA open standard to ensure
                                    interoperability and universal access to provenance data across the web.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Manifesto */}
                <section className="px-6 py-24">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8">Our Manifesto</h2>
                        <div className="prose prose-lg text-slate-600">
                            <p className="mb-6">
                                In an era where seeing is no longer believing, the foundation of our shared reality is at risk.
                                Generative AI, while powerful, has democratized the creation of convincing fabrications.
                                Without a mechanism for verification, misinformation thrives, and trust erodes.
                            </p>
                            <p className="mb-6">
                                TrueOrigins is not just a tool; it is a movement towards a verifiable future.
                                We are building the trust layer of the internet. We envision a world where every piece of
                                digital content carries its own history—a tamper-evident record of its creation and edits.
                            </p>
                            <p>
                                We stand for the right to know the origin of what we consume. We stand for the protection
                                of creative rights. We stand for truth.
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
