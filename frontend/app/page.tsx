"use client";

import { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, AlertCircle, Loader2, Shield, Search, FileCheck } from 'lucide-react';

export default function Home() {
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
      setError(err.response?.data?.detail || "An error occurred during upload.");
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            True<span className="text-purple-400">Origins</span>
          </h1>
          <div className="flex gap-6 text-sm">
            <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
            <a href="#analyze" className="text-gray-300 hover:text-white transition">Analyze</a>
            <a href="#about" className="text-gray-300 hover:text-white transition">About</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full text-purple-300 text-sm mb-6">
            <Shield className="w-4 h-4" />
            C2PA Standards Compliant
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Is your media <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              human-crafted
            </span> or{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              AI-generated
            </span>?
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            TrueOrigins uses advanced metadata analysis, C2PA verification, and intelligent heuristics
            to determine the authenticity of your images, videos, and PDFs.
          </p>
          <a href="#analyze" className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold transition-all transform hover:scale-105">
            <Search className="w-5 h-5" />
            Analyze Your Media
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/50 transition">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <FileCheck className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Metadata Analysis</h3>
              <p className="text-gray-400">Extract and analyze EXIF data, timestamps, camera info, and software signatures to detect anomalies.</p>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-cyan-500/50 transition">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">C2PA Verification</h3>
              <p className="text-gray-400">Validate Content Credentials using the C2PA standard to verify provenance and authenticity chains.</p>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-pink-500/50 transition">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Pattern Detection</h3>
              <p className="text-gray-400">Identify telltale signs of AI generation through filename patterns and structural analysis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Analyze Section */}
      <section id="analyze" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Analyze Your Media</h2>
          <p className="text-gray-400 text-center mb-10">Upload an image, video, or PDF to get a comprehensive authenticity report.</p>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
            {/* Upload Area */}
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer hover:bg-white/5 border-gray-600 hover:border-purple-500 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-300">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, MP4, MOV, or PDF</p>
              </div>
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,video/*,.pdf" />
            </label>

            {/* Selected File */}
            {file && (
              <div className="mt-6 flex items-center justify-between p-4 bg-black/30 rounded-xl">
                <div className="flex items-center gap-4">
                  <FileText className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="text-sm font-medium text-white truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={handleUploadAndAnalyze}
                  disabled={uploading}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {uploading ? 'Uploading...' : 'Analyze'}
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-black/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">About TrueOrigins</h2>
          <p className="text-gray-400 text-lg mb-8">
            TrueOrigins is an open-source synthetic media verification platform built on the C2PA
            Content Credentials standard. We provide transparency, privacy, and explainability in
            media authenticity verification.
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <span className="px-4 py-2 bg-white/5 rounded-full text-gray-300">Open Source</span>
            <span className="px-4 py-2 bg-white/5 rounded-full text-gray-300">Privacy First</span>
            <span className="px-4 py-2 bg-white/5 rounded-full text-gray-300">C2PA Compliant</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-sm text-gray-500">
          <span>© 2024 TrueOrigins. All rights reserved.</span>
          <span>Built with FastAPI & Next.js</span>
        </div>
      </footer>
    </div>
  );
}
