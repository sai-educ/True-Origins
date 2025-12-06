"use client";

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { CheckCircle, Loader2, AlertCircle, Download, ArrowLeft, FileText, Shield, Search, Calculator, ChevronDown, ChevronRight, Fingerprint } from 'lucide-react';

interface StepResult {
    step: string;
    status: 'pending' | 'running' | 'complete' | 'error';
    data?: any;
    error?: string;
}

export default function AnalyzePage() {
    const searchParams = useSearchParams();
    const filepath = searchParams.get('filepath');
    const filename = searchParams.get('filename');
    const sizeParam = searchParams.get('size');
    const size = sizeParam ? parseInt(sizeParam) : 0;

    const [steps, setSteps] = useState<StepResult[]>([
        { step: 'filename_heuristics', status: 'pending' },
        { step: 'metadata_extraction', status: 'pending' },
        { step: 'c2pa_verification', status: 'pending' },
        { step: 'final_score', status: 'pending' },
    ]);
    const [finalReport, setFinalReport] = useState<any>(null);
    const reportRef = useRef<HTMLDivElement>(null);
    const hasStarted = useRef(false);

    // Helper to get file extension and kind
    const getFileInfo = (fname: string) => {
        const ext = fname.split('.').pop()?.toUpperCase() || 'UNKNOWN';
        let kind = 'Unknown File';
        let description = '';

        if (['JPG', 'JPEG', 'PNG', 'WEBP', 'TIFF'].includes(ext)) {
            kind = 'Image';
            if (ext === 'PNG') description = 'Portable Network Graphics';
            if (ext === 'JPG' || ext === 'JPEG') description = 'Joint Photographic Experts Group';
        } else if (['MP4', 'MOV', 'AVI'].includes(ext)) {
            kind = 'Video';
        } else if (ext === 'PDF') {
            kind = 'Document';
            description = 'Portable Document Format';
        }

        return { ext, kind, description };
    };

    const fileInfo = filename ? getFileInfo(filename) : { ext: '', kind: '', description: '' };

    useEffect(() => {
        if (filepath && filename && !hasStarted.current) {
            hasStarted.current = true;
            runAnalysis();
        }
    }, [filepath, filename]);

    const updateStep = (stepName: string, updates: Partial<StepResult>) => {
        setSteps(prev => prev.map(s =>
            s.step === stepName ? { ...s, ...updates } : s
        ));
    };

    const runAnalysis = async () => {
        if (!filepath || !filename) return;

        // Step 1: Filename Heuristics
        updateStep('filename_heuristics', { status: 'running' });
        try {
            const res = await axios.post('http://localhost:8000/api/analyze/filename', { filename });
            updateStep('filename_heuristics', { status: 'complete', data: res.data.data });
        } catch (err: any) {
            updateStep('filename_heuristics', { status: 'error', error: err.message });
        }

        // Step 2: Metadata Extraction
        updateStep('metadata_extraction', { status: 'running' });
        try {
            const res = await axios.post('http://localhost:8000/api/analyze/metadata', { filepath });
            updateStep('metadata_extraction', { status: 'complete', data: res.data.data });
        } catch (err: any) {
            updateStep('metadata_extraction', { status: 'error', error: err.message });
        }

        // Step 3: C2PA Verification
        updateStep('c2pa_verification', { status: 'running' });
        try {
            const res = await axios.post('http://localhost:8000/api/analyze/c2pa', { filepath });
            updateStep('c2pa_verification', { status: 'complete', data: res.data.data });
        } catch (err: any) {
            updateStep('c2pa_verification', { status: 'error', error: err.message });
        }

        // Step 4: Final Score
        updateStep('final_score', { status: 'running' });
        try {
            const res = await axios.post('http://localhost:8000/api/analyze/score', { filepath });
            updateStep('final_score', { status: 'complete', data: res.data.data });
            setFinalReport(res.data.data);
        } catch (err: any) {
            updateStep('final_score', { status: 'error', error: err.message });
        }
    };

    const downloadPDF = () => {
        // ... (PDF generation logic - keeping existing logic for now, can be updated if needed)
        window.print();
    };

    const getStepIcon = (step: string) => {
        switch (step) {
            case 'filename_heuristics': return <FileText className="w-5 h-5" />;
            case 'metadata_extraction': return <Search className="w-5 h-5" />;
            case 'c2pa_verification': return <Shield className="w-5 h-5" />;
            case 'final_score': return <Calculator className="w-5 h-5" />;
            default: return null;
        }
    };

    const getStepTitle = (step: string) => {
        switch (step) {
            case 'filename_heuristics': return 'Filename Heuristics';
            case 'metadata_extraction': return 'Metadata Extraction';
            case 'c2pa_verification': return 'C2PA Verification';
            case 'final_score': return 'Final Score Calculation';
            default: return step;
        }
    };

    if (!filepath || !filename) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-slate-900 mb-2">No Asset Selected</h1>
                    <p className="text-slate-500 mb-6">Please upload a file from the dashboard.</p>
                    <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-md transition">
                        <ArrowLeft className="w-4 h-4" /> Return to Dashboard
                    </a>
                </div>
            </div>
        );
    }

    // Construct local file URL for preview (assuming localhost for now, in prod would need a proper static file server or blob URL)
    // Note: Since we are running locally, we can try to access the file if it's in public or served via API.
    // For this MVP, we'll use a placeholder or try to load it if it's an image.
    // Actually, since the file is on the server, we can't easily preview it without an endpoint.
    // I'll add a placeholder for now or use the file object if I had access to it (but I only have filepath string here).
    // Wait, in the previous page we had the File object. We lost it on navigation.
    // To fix this properly, we should probably pass the file object or a blob URL, but for now I'll use a generic icon if I can't load it.
    // However, the user asked for a preview. I will assume for now we can't display the local path directly in browser due to security.
    // I will use a large icon representation instead which is standard for "server-side" analysis unless we serve the file back.

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            {/* Header */}
            <div className="border-b border-slate-200 bg-white sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <a href="/verify" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition font-medium text-sm">
                        <ArrowLeft className="w-4 h-4" /> Back to Upload
                    </a>
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-slate-900" />
                        <span className="font-bold text-slate-900">TrueOrigins Analysis</span>
                    </div>
                    {finalReport && (
                        <button
                            onClick={downloadPDF}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md text-sm font-medium transition shadow-sm"
                        >
                            <Download className="w-4 h-4" /> Export Report
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-12" ref={reportRef}>

                {/* File Info & Preview Section */}
                <div className="bg-slate-50 rounded-xl p-8 mb-10 border border-slate-200 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Preview Area */}
                        <div className="w-full md:w-1/3 aspect-square bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden border border-slate-300 relative">
                            {fileInfo.kind === 'Image' ? (
                                <img
                                    src={`http://localhost:8000/uploads/${filename}`}
                                    alt="File Preview"
                                    className="w-full h-full object-contain bg-slate-100"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        // Show fallback
                                        const parent = (e.target as HTMLElement).parentElement;
                                        if (parent) {
                                            const fallback = document.createElement('div');
                                            fallback.className = "text-slate-400 flex flex-col items-center";
                                            fallback.innerHTML = '<svg class="w-24 h-24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg><span class="mt-4 text-xs font-mono uppercase tracking-widest">Preview Failed</span>';
                                            parent.appendChild(fallback);
                                        }
                                    }}
                                />
                            ) : (
                                <div className="text-slate-400 flex flex-col items-center">
                                    {fileInfo.kind === 'Video' ? <FileText className="w-24 h-24" /> :
                                        <FileText className="w-24 h-24" />}
                                    <span className="mt-4 text-xs font-mono uppercase tracking-widest">
                                        {fileInfo.kind === 'Video' ? 'Video Preview' : 'Document Preview'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* File Details */}
                        <div className="flex-1 space-y-6">
                            <div>
                                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">File Name</h2>
                                <p className="text-2xl font-bold text-slate-900 break-all">{filename}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Format</h2>
                                    <p className="text-lg font-medium text-slate-900">{fileInfo.ext}</p>
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Kind</h2>
                                    <p className="text-lg font-medium text-slate-900">
                                        {fileInfo.kind} <span className="text-slate-500 text-sm font-normal">({fileInfo.description})</span>
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">File Size</h2>
                                    <p className="text-lg font-medium text-slate-900">
                                        {size > 0 ? (
                                            <>
                                                {(size / 1024 / 1024).toFixed(2)} MB <span className="text-slate-500 text-sm font-normal">({(size / 1024).toFixed(0)} KB)</span>
                                            </>
                                        ) : (
                                            <span className="text-slate-400 text-sm">Size unavailable</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Digital Fingerprint Section (formerly Synthetic Probability) */}
                            {finalReport && (
                                <div className="pt-6 border-t border-slate-200">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Fingerprint className="w-6 h-6 text-slate-900" />
                                        <h2 className="text-lg font-bold text-slate-900">Digital Fingerprint Analysis</h2>
                                    </div>

                                    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-inner">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-slate-600 font-medium">Authenticity Score</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${finalReport.confidence_level === 'High' ? 'bg-green-100 text-green-800' :
                                                finalReport.confidence_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {finalReport.confidence_level} Confidence
                                            </span>
                                        </div>

                                        <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden mb-2">
                                            <div
                                                className={`absolute top-0 left-0 h-full transition-all duration-1000 ${finalReport.synthetic_probability > 70 ? 'bg-red-500' :
                                                    finalReport.synthetic_probability > 40 ? 'bg-yellow-500' :
                                                        'bg-green-500'
                                                    }`}
                                                style={{ width: `${finalReport.synthetic_probability}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-400 font-mono">
                                            <span>Human Crafted</span>
                                            <span>AI Generated</span>
                                        </div>

                                        <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                                            {finalReport.synthetic_probability > 70 ?
                                                "High probability of synthetic origin detected. Multiple heuristic and metadata indicators suggest this file was generated by an AI model." :
                                                finalReport.synthetic_probability > 40 ?
                                                    "Ambiguous origin. Some indicators suggest potential manipulation or synthetic generation, but results are inconclusive." :
                                                    "High probability of human origin. Metadata and structural integrity align with authentic capture devices."}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* AI Tool Banner (if detected) */}
                {finalReport?.ai_tool?.detected && (
                    <div className="mb-10 bg-slate-900 text-white rounded-xl p-8 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-6">
                                {finalReport.ai_tool.logo && (
                                    <div className="w-16 h-16 bg-white rounded-xl p-2 flex items-center justify-center">
                                        <img
                                            src={finalReport.ai_tool.logo}
                                            alt={finalReport.ai_tool.name}
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Potential Media created by</p>
                                    <h2 className="text-3xl font-bold">{finalReport.ai_tool.name}</h2>
                                    <p className="text-slate-400 mt-1">{finalReport.ai_tool.reason}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="px-4 py-2 bg-white/10 rounded-full text-sm font-bold border border-white/20">
                                    {finalReport.ai_tool.confidence.toUpperCase()} CONFIDENCE
                                </span>
                            </div>
                        </div>

                        {/* Disclaimer for filename-based detection */}
                        {finalReport.ai_tool.disclaimer && (
                            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-yellow-200 leading-relaxed">
                                    {finalReport.ai_tool.disclaimer}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Analysis Logs */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <FileText className="w-5 h-5" /> Analysis Logs
                    </h3>
                    {steps.map((step, index) => (
                        <div
                            key={step.step}
                            className={`bg-white rounded-lg border transition-all duration-300 ${step.status === 'complete' ? 'border-slate-200' :
                                step.status === 'running' ? 'border-slate-400 shadow-md' :
                                    'border-slate-100 opacity-60'
                                }`}
                        >
                            <div className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${step.status === 'complete' ? 'bg-slate-50 border-slate-200 text-slate-700' :
                                        step.status === 'running' ? 'bg-slate-900 border-slate-900 text-white' :
                                            'bg-slate-50 border-slate-100 text-slate-300'
                                        }`}>
                                        {step.status === 'running' ? <Loader2 className="w-5 h-5 animate-spin" /> :
                                            step.status === 'complete' ? <CheckCircle className="w-5 h-5" /> :
                                                getStepIcon(step.step)}
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${step.status === 'running' ? 'text-slate-900' : 'text-slate-700'}`}>
                                            {getStepTitle(step.step)}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {step.status === 'pending' ? 'Queued' :
                                                step.status === 'running' ? 'Processing...' :
                                                    step.status === 'complete' ? 'Completed successfully' :
                                                        'Error encountered'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Step Details */}
                            {step.status === 'complete' && step.data && (
                                <div className="px-5 pb-5 pl-[4.5rem]">
                                    {step.data.error ? (
                                        <div className="p-4 bg-red-50 border border-red-100 rounded-md text-red-600 text-sm">
                                            <p className="font-bold mb-1">Extraction Failed</p>
                                            <p>{step.data.error}</p>
                                            {step.data.error.includes("ExifTool not found") && (
                                                <div className="mt-3">
                                                    <p className="mb-2 text-slate-700">Please install ExifTool to view detailed metadata:</p>
                                                    <a
                                                        href="https://exiftool.org/install.html#MacOS"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 transition"
                                                    >
                                                        Download ExifTool for macOS <Download className="w-3 h-3" />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            {/* Raw Data (Collapsed by default) */}
                                            <details className="group mb-6">
                                                <summary className="cursor-pointer text-xs font-medium text-slate-500 hover:text-slate-900 transition flex items-center gap-1">
                                                    <ChevronRight className="w-3 h-3 group-open:rotate-90 transition-transform" />
                                                    View Raw Data
                                                </summary>
                                                <pre className="mt-3 bg-slate-50 border border-slate-200 p-4 rounded-md text-xs text-slate-600 overflow-x-auto font-mono">
                                                    {JSON.stringify(step.data.raw_data || step.data, null, 2)}
                                                </pre>
                                            </details>

                                            {/* Detailed Report */}
                                            {step.step === 'metadata_extraction' && step.data.categorized && (
                                                <div className="space-y-8">
                                                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">Report</h3>

                                                    {/* Image Metadata */}
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">Image Metadata</h4>
                                                        <div className="grid grid-cols-1 gap-y-2">
                                                            {step.data.categorized["Image Metadata"] && Object.entries(step.data.categorized["Image Metadata"]).map(([key, value]) => (
                                                                <div key={key} className="flex gap-4 py-1 border-b border-slate-50 last:border-0">
                                                                    <span className="text-sm font-medium text-slate-500 w-1/3">{key}</span>
                                                                    <span className="text-sm text-slate-900 font-medium break-all flex-1">{String(value)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Location */}
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">Location</h4>
                                                        {step.data.categorized["Location"] && Object.keys(step.data.categorized["Location"]).length > 0 ? (
                                                            <div className="grid grid-cols-1 gap-y-2">
                                                                {Object.entries(step.data.categorized["Location"]).map(([key, value]) => (
                                                                    <div key={key} className="flex gap-4 py-1 border-b border-slate-50 last:border-0">
                                                                        <span className="text-sm font-medium text-slate-500 w-1/3">{key}</span>
                                                                        <span className="text-sm text-slate-900 font-medium break-all flex-1">{String(value)}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-slate-600 text-sm italic">
                                                                This photo doesn't include location data. We can't find where it was taken.
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Privacy Statistic */}
                                                    {step.data.statistics && (
                                                        <div className="p-5 bg-blue-50 border border-blue-100 rounded-lg">
                                                            <div className="flex items-start gap-3">
                                                                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                                <div>
                                                                    <p className="text-sm text-blue-800 leading-relaxed mb-3">
                                                                        Metadata takes <strong>{(step.data.statistics.metadata_size_bytes / 1024).toFixed(2)} KB</strong> ({step.data.statistics.percentage}%) of this image and may include sensitive info.
                                                                        To protect your privacy, download this image without metadata by clicking the button below.
                                                                    </p>
                                                                    <button className="text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition shadow-sm">
                                                                        Download without Metadata
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Full Metadata */}
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">Full Metadata</h4>
                                                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs font-mono grid grid-cols-1 gap-y-1 max-h-96 overflow-y-auto">
                                                            {Object.entries(step.data.full_metadata || step.data.raw_data || step.data).map(([key, value]) => (
                                                                <div key={key} className="flex gap-4 border-b border-slate-200/50 last:border-0 py-1">
                                                                    <span className="font-semibold text-slate-600 w-1/3 md:w-1/4 truncate" title={key}>{key}</span>
                                                                    <span className="text-slate-800 break-all flex-1">{String(value)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
}
