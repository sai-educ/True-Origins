"use client";

import { useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { Upload, FileText, AlertCircle, Loader2, Shield, ArrowRight } from 'lucide-react';

export default function VerifyPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUploadAndAnalyze = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const uploadRes = await axios.post('http://localhost:8000/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const { filepath } = uploadRes.data;

            // Navigate to analyze page with file info
            window.location.href = `/analyze?filepath=${encodeURIComponent(filepath)}&filename=${encodeURIComponent(file.name)}`;

        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || "An error occurred during upload. Please try again.");
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <Navbar />

            <main className="pt-20 pb-24">
                {/* Header */}
                <section className="px-6 mb-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
                            Verify Media Authenticity
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Upload digital assets to initiate our comprehensive forensic analysis.
                            We examine C2PA signatures, metadata, and structural integrity to determine origin.
                        </p>
                    </div>
                </section>

                {/* Upload Interface */}
                <section className="px-6">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 md:p-12 transition-all hover:shadow-2xl hover:shadow-slate-200/60">

                            {/* Upload Area */}
                            <label className="group flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition-all">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Upload className="w-8 h-8 text-slate-500 group-hover:text-slate-900 transition-colors" />
                                    </div>
                                    <p className="mb-2 text-lg font-medium text-slate-700">
                                        Drop your file here to begin
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Supports JPG, PNG, PDF, MP4, MOV
                                    </p>
                                </div>
                                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,video/*,.pdf" />
                            </label>

                            {/* Selected File */}
                            {file && (
                                <div className="mt-8">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white rounded-md border border-slate-200 shadow-sm">
                                                <FileText className="w-6 h-6 text-slate-700" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 truncate max-w-xs">{file.name}</p>
                                                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleUploadAndAnalyze}
                                            disabled={uploading}
                                            className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
                                        >
                                            {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                                            {uploading ? 'Processing...' : 'Start Analysis'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-700">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-sm font-medium">{error}</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
                            <div className="p-4">
                                <Shield className="w-8 h-8 text-slate-900 mx-auto mb-3" />
                                <h3 className="font-bold text-slate-900 mb-1">Secure</h3>
                                <p className="text-xs text-slate-500">Files are processed in an isolated environment.</p>
                            </div>
                            <div className="p-4">
                                <Loader2 className="w-8 h-8 text-slate-900 mx-auto mb-3" />
                                <h3 className="font-bold text-slate-900 mb-1">Fast</h3>
                                <p className="text-xs text-slate-500">Real-time analysis and immediate results.</p>
                            </div>
                            <div className="p-4">
                                <FileText className="w-8 h-8 text-slate-900 mx-auto mb-3" />
                                <h3 className="font-bold text-slate-900 mb-1">Detailed</h3>
                                <p className="text-xs text-slate-500">Comprehensive reports with actionable insights.</p>
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
