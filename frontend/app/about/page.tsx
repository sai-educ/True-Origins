import Navbar from '../../components/Navbar';
import { Shield, Mail, Linkedin, Github, Globe } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <Navbar />

            <main className="pt-20 pb-24">
                {/* Header */}
                <section className="px-6 mb-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
                            Leadership
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Meet the scientists and engineers behind TrueOrigins.
                        </p>
                    </div>
                </section>

                {/* Profiles */}
                <section className="px-6 mb-24">
                    <div className="max-w-4xl mx-auto space-y-24">

                        {/* Sai Gattupalli */}
                        <div className="flex flex-col md:flex-row gap-12 items-start">
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">Sai Gattupalli, Ph.D.</h2>
                                <p className="text-slate-500 font-medium mb-6">Math and Computational Literacy • Learning Technology • AI-Enhanced Teaching</p>

                                <div className="prose text-slate-600 mb-8 text-justify">
                                    <p className="mb-4">
                                        As a scientist in education technology and learning sciences, Dr. Gattupalli specializes in the design and study of teaching and learning systems that support STEM education. His work focuses on computational literacies, mathematics education, and the utility of AI for enhanced instruction.
                                    </p>
                                    <p className="mb-4">
                                        He investigates how intelligent tutoring systems, game-based platforms, and multimodal AI tools can be integrated into educational settings to align with curriculum goals. His research bridges classroom implementation with institutional planning to support scalable, research-informed decisions.
                                    </p>
                                    <p>
                                        Dr. Gattupalli develops interactive STEM education technology for K-12 and higher education, contributes to open access, and supports educator development in AI literacy and computational thinking.
                                    </p>
                                </div>

                                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-8">
                                    <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">Education</h3>
                                    <ul className="space-y-3 text-sm text-slate-700">
                                        <li>
                                            <span className="font-semibold block">Ph.D. in Mathematics, Science, and Learning Technologies</span>
                                            University of Massachusetts Amherst, MA, USA
                                        </li>
                                        <li>
                                            <span className="font-semibold block">M.S. in Management Sciences</span>
                                            Merrimack College, Andover, MA, USA
                                        </li>
                                        <li>
                                            <span className="font-semibold block">B.S. in Computer Sciences & Physics</span>
                                            Osmania University, Hyderabad, India
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <hr className="border-slate-200" />

                        {/* Sam Talluri */}
                        <div className="flex flex-col md:flex-row gap-12 items-start">
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">Sam Talluri, Ph.D.</h2>
                                <p className="text-slate-500 font-medium mb-6">Scientist / Engineer</p>

                                <div className="prose text-slate-600 mb-8 text-justify">
                                    <p>
                                        Dr. Syamal Sanmath Tallury is a prominent scientist with an academic background in Fiber and Polymer Science as well as Material Science & Engineering. His distinguished work includes molecular dynamics simulations of carbon nanotubes wrapped by polymers. He received an award for the best poster at a scientific workshop while associated with North Carolina State University.
                                    </p>
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
