"use client";

import { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function FileUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [report, setReport] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setReport(null);
            setError(null);
        }
    };

    const handleUploadAndAnalyze = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            // 1. Upload
            const formData = new FormData();
            formData.append('file', file);

            const uploadRes = await axios.post('http://localhost:8000/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const { filepath } = uploadRes.data;
            setUploading(false);
            setAnalyzing(true);

            // 2. Analyze
            const analyzeRes = await axios.post('http://localhost:8000/api/analyze', { filepath });
            setReport(analyzeRes.data);

        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || "An error occurred during analysis.");
        } finally {
            setUploading(false);
            setAnalyzing(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-2xl">
            <div className="flex flex-col items-center justify-center space-y-6">

                {/* Upload Area */}
                <div className="w-full">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-white/5 border-gray-500 hover:border-blue-500 transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-12 h-12 mb-4 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-300"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-400">Images, Videos, or PDFs</p>
                        </div>
                        <input type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                </div>

                {/* Selected File */}
                {file && (
                    <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg w-full">
                        <FileText className="w-8 h-8 text-blue-400" />
                        <div className="flex-1 truncate">
                            <p className="text-sm font-medium text-white truncate">{file.name}</p>
                            <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button
                            onClick={handleUploadAndAnalyze}
                            disabled={uploading || analyzing}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {(uploading || analyzing) ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {uploading ? 'Uploading...' : analyzing ? 'Analyzing...' : 'Analyze Media'}
                        </button>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg w-full flex items-center text-red-200">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        {error}
                    </div>
                )}

                {/* Report Card */}
                {report && (
                    <div className="w-full bg-gray-900/80 rounded-xl overflow-hidden border border-gray-700 mt-6">
                        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Analysis Report</h3>
                            <div className={`px-4 py-1 rounded-full text-sm font-bold ${report.confidence_level === 'High' ? 'bg-green-500/20 text-green-400' :
                                    report.confidence_level === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                                }`}>
                                {report.confidence_level} Confidence
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Score */}
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Synthetic Probability</span>
                                <div className="text-3xl font-bold text-white">{report.synthetic_probability}%</div>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000"
                                    style={{ width: `${report.synthetic_probability}%` }}
                                ></div>
                            </div>

                            {/* Breakdown */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                <div className="p-4 bg-white/5 rounded-lg">
                                    <div className="text-xs text-gray-400 uppercase">Filename Heuristics</div>
                                    <div className="text-lg font-semibold text-white mt-1">{report.breakdown.filename_score}/100</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-lg">
                                    <div className="text-xs text-gray-400 uppercase">Metadata Integrity</div>
                                    <div className="text-lg font-semibold text-white mt-1">{report.breakdown.metadata_score}/100</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-lg">
                                    <div className="text-xs text-gray-400 uppercase">C2PA Provenance</div>
                                    <div className="text-lg font-semibold text-white mt-1">{report.breakdown.c2pa_score}/100</div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="mt-4">
                                <h4 className="text-sm font-semibold text-gray-300 mb-2">Detailed Findings</h4>
                                <pre className="bg-black/50 p-4 rounded-lg text-xs text-gray-400 overflow-x-auto">
                                    {JSON.stringify(report.details, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
