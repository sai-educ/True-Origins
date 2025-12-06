"use client";

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { CheckCircle, Loader2, AlertCircle, Download, ArrowLeft, FileText, Shield, Search, Calculator, ChevronDown, ChevronRight } from 'lucide-react';

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

    const [steps, setSteps] = useState<StepResult[]>([
        { step: 'filename_heuristics', status: 'pending' },
        { step: 'metadata_extraction', status: 'pending' },
        { step: 'c2pa_verification', status: 'pending' },
        { step: 'final_score', status: 'pending' },
    ]);
    const [finalReport, setFinalReport] = useState<any>(null);
    const reportRef = useRef<HTMLDivElement>(null);
    const hasStarted = useRef(false);

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
        // Create printable content
        const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>TrueOrigins Verification Report</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 60px; max-width: 800px; margin: 0 auto; color: #1a202c; }
          .header { border-bottom: 2px solid #1a202c; padding-bottom: 20px; margin-bottom: 40px; }
          h1 { font-size: 24px; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
          .meta { font-size: 14px; color: #718096; margin-top: 10px; }
          
          .score-section { background: #f7fafc; padding: 30px; border-radius: 4px; text-align: center; margin-bottom: 40px; border: 1px solid #e2e8f0; }
          .score-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #718096; }
          .score-value { font-size: 64px; font-weight: 800; margin: 10px 0; color: #1a202c; }
          .confidence { font-weight: 600; padding: 4px 12px; border-radius: 99px; display: inline-block; font-size: 12px; }
          
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
          .metric { padding: 20px; border: 1px solid #e2e8f0; border-radius: 4px; text-align: center; }
          .metric-val { font-size: 24px; font-weight: 700; color: #1a202c; }
          .metric-label { font-size: 11px; text-transform: uppercase; color: #718096; margin-top: 5px; }
          
          .section-title { font-size: 16px; font-weight: 700; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px; margin-top: 40px; }
          
          .data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
          .data-table th, .data-table td { text-align: left; padding: 12px; border-bottom: 1px solid #e2e8f0; }
          .data-table th { color: #718096; font-weight: 600; width: 40%; }
          .data-table td { color: #1a202c; font-weight: 500; }
          
          .footer { margin-top: 60px; font-size: 11px; color: #a0aec0; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Verification Report</h1>
          <div class="meta">
            File: ${filename} <br/>
            Date: ${new Date().toLocaleString()} <br/>
            ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}
          </div>
        </div>
        
        <div class="score-section">
          <div class="score-label">Synthetic Probability Score</div>
          <div class="score-value">${finalReport?.synthetic_probability}%</div>
          <div class="confidence" style="background: ${finalReport?.confidence_level === 'High' ? '#def7ec' : '#fefcbf'}; color: ${finalReport?.confidence_level === 'High' ? '#03543f' : '#744210'}">
            ${finalReport?.confidence_level.toUpperCase()} CONFIDENCE
          </div>
        </div>

        <div class="grid">
          <div class="metric">
            <div class="metric-val">${finalReport?.breakdown?.filename_score || 0}</div>
            <div class="metric-label">Filename Risk</div>
          </div>
          <div class="metric">
            <div class="metric-val">${finalReport?.breakdown?.metadata_score || 0}</div>
            <div class="metric-label">Metadata Risk</div>
          </div>
          <div class="metric">
            <div class="metric-val">${finalReport?.breakdown?.c2pa_score || 0}</div>
            <div class="metric-label">Provenance Risk</div>
          </div>
        </div>

        <div class="footer">
          Generated by TrueOrigins Verification Engine. <br/>
          This report is for informational purposes only.
        </div>
      </body>
      </html>
    `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
            }, 250);
        }
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

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            {/* Header */}
            <div className="border-b border-slate-200 bg-white sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition font-medium text-sm">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
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
                {/* File Info */}
                <div className="bg-slate-50 rounded-lg p-6 mb-10 border border-slate-200 flex items-center gap-5">
                    <div className="p-4 bg-white rounded-md border border-slate-200 shadow-sm">
                        <FileText className="w-8 h-8 text-slate-700" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{filename}</h2>
                        <p className="text-sm text-slate-500 mt-1">
                            {finalReport ? 'Analysis Complete' : 'Processing Asset...'}
                        </p>
                    </div>
                </div>

                {/* Final Report */}
                {finalReport && (
                    <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* AI Tool Banner */}
                        {finalReport.ai_tool?.detected && (
                            <div className="bg-slate-900 text-white rounded-t-xl p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {finalReport.ai_tool.logo && (
                                        <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center">
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
                                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Detected Origin</p>
                                        <h2 className="text-2xl font-bold">{finalReport.ai_tool.name}</h2>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium border border-white/20">
                                        {finalReport.ai_tool.confidence.toUpperCase()} CONFIDENCE
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className={`bg-white border border-slate-200 shadow-xl shadow-slate-200/50 ${finalReport.ai_tool?.detected ? 'rounded-b-xl border-t-0' : 'rounded-xl'}`}>
                            <div className="p-8 border-b border-slate-100">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="text-center md:text-left">
                                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Synthetic Probability</p>
                                        <div className="flex items-baseline gap-2 justify-center md:justify-start">
                                            <span className="text-6xl font-extrabold text-slate-900">{finalReport.synthetic_probability}%</span>
                                            <span className={`text-sm font-bold px-3 py-1 rounded-full ${finalReport.confidence_level === 'High' ? 'bg-green-100 text-green-700' :
                                                    finalReport.confidence_level === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {finalReport.confidence_level} Confidence
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="text-center px-6 py-4 bg-slate-50 rounded-lg border border-slate-100">
                                            <div className="text-2xl font-bold text-slate-900">{finalReport.breakdown.filename_score}</div>
                                            <div className="text-xs font-medium text-slate-500 uppercase mt-1">Filename</div>
                                        </div>
                                        <div className="text-center px-6 py-4 bg-slate-50 rounded-lg border border-slate-100">
                                            <div className="text-2xl font-bold text-slate-900">{finalReport.breakdown.metadata_score}</div>
                                            <div className="text-xs font-medium text-slate-500 uppercase mt-1">Metadata</div>
                                        </div>
                                        <div className="text-center px-6 py-4 bg-slate-50 rounded-lg border border-slate-100">
                                            <div className="text-2xl font-bold text-slate-900">{finalReport.breakdown.c2pa_score}</div>
                                            <div className="text-xs font-medium text-slate-500 uppercase mt-1">C2PA</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Analysis Steps */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Forensic Analysis Log</h3>
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
                                    {/* Special display for metadata extraction */}
                                    {step.step === 'metadata_extraction' && step.data.key_attributes && (
                                        <div className="mb-4 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-slate-100 pt-4">
                                            {Object.entries(step.data.key_attributes).map(([key, value]) => (
                                                <div key={key}>
                                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{key}</p>
                                                    <p className="text-sm text-slate-900 font-medium break-all">
                                                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <details className="group">
                                        <summary className="cursor-pointer text-xs font-medium text-slate-500 hover:text-slate-900 transition flex items-center gap-1">
                                            <ChevronRight className="w-3 h-3 group-open:rotate-90 transition-transform" />
                                            View Raw Data
                                        </summary>
                                        <pre className="mt-3 bg-slate-50 border border-slate-200 p-4 rounded-md text-xs text-slate-600 overflow-x-auto font-mono">
                                            {JSON.stringify(step.data.raw_data || step.data, null, 2)}
                                        </pre>
                                    </details>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
