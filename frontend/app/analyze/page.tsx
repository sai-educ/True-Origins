"use client";

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { CheckCircle, Loader2, AlertCircle, Download, ArrowLeft, FileText, Shield, Search, Calculator } from 'lucide-react';

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
        <title>TrueOrigins Analysis Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          h1 { color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px; }
          h2 { color: #334155; margin-top: 30px; }
          .score-box { background: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .score { font-size: 48px; font-weight: bold; color: ${finalReport?.synthetic_probability > 70 ? '#ef4444' : finalReport?.synthetic_probability > 40 ? '#f59e0b' : '#22c55e'}; }
          .label { color: #64748b; font-size: 14px; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 20px 0; }
          .card { background: #f8fafc; padding: 16px; border-radius: 8px; text-align: center; }
          .card-value { font-size: 24px; font-weight: bold; color: #1e293b; }
          .card-label { font-size: 12px; color: #64748b; margin-top: 4px; }
          pre { background: #f1f5f9; padding: 12px; border-radius: 6px; overflow-x: auto; font-size: 11px; }
          .section { margin: 24px 0; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; }
          .footer { margin-top: 40px; text-align: center; color: #94a3b8; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>TrueOrigins Analysis Report</h1>
        <p><strong>File:</strong> ${filename}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        
        <div class="score-box">
          <div class="score">${finalReport?.synthetic_probability}%</div>
          <div class="label">Synthetic Probability</div>
          <div style="margin-top: 8px; color: ${finalReport?.confidence_level === 'High' ? '#22c55e' : finalReport?.confidence_level === 'Medium' ? '#f59e0b' : '#ef4444'}">
            ${finalReport?.confidence_level} Confidence
          </div>
        </div>

        <h2>Score Breakdown</h2>
        <div class="grid">
          <div class="card">
            <div class="card-value">${finalReport?.breakdown?.filename_score || 0}</div>
            <div class="card-label">Filename Score</div>
          </div>
          <div class="card">
            <div class="card-value">${finalReport?.breakdown?.metadata_score || 0}</div>
            <div class="card-label">Metadata Score</div>
          </div>
          <div class="card">
            <div class="card-value">${finalReport?.breakdown?.c2pa_score || 0}</div>
            <div class="card-label">C2PA Score</div>
          </div>
        </div>

        <h2>Analysis Steps</h2>
        ${steps.map(s => `
          <div class="section">
            <h3>${s.step.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
            <p>Status: ${s.status}</p>
            ${s.data ? `<pre>${JSON.stringify(s.data, null, 2)}</pre>` : ''}
          </div>
        `).join('')}

        <div class="footer">
          <p>Generated by TrueOrigins - Synthetic Media Verification</p>
          <p>Based on C2PA Standards</p>
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
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2">No File Selected</h1>
                    <p className="text-gray-400 mb-6">Please upload a file from the home page first.</p>
                    <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <div className="border-b border-white/10 bg-black/30 backdrop-blur-md">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </a>
                    <h1 className="text-xl font-bold text-white">Analysis in Progress</h1>
                    {finalReport && (
                        <button
                            onClick={downloadPDF}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition"
                        >
                            <Download className="w-4 h-4" /> Download PDF
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-10" ref={reportRef}>
                {/* File Info */}
                <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10">
                    <div className="flex items-center gap-4">
                        <FileText className="w-10 h-10 text-purple-400" />
                        <div>
                            <h2 className="text-lg font-semibold text-white">{filename}</h2>
                            <p className="text-sm text-gray-400">Analyzing file authenticity...</p>
                        </div>
                    </div>
                </div>

                {/* Analysis Steps */}
                <div className="space-y-4 mb-8">
                    {steps.map((step, index) => (
                        <div
                            key={step.step}
                            className={`bg-white/5 rounded-xl border transition-all duration-500 ${step.status === 'complete' ? 'border-green-500/50' :
                                    step.status === 'running' ? 'border-purple-500/50 animate-pulse' :
                                        step.status === 'error' ? 'border-red-500/50' :
                                            'border-white/10'
                                }`}
                        >
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.status === 'complete' ? 'bg-green-500/20 text-green-400' :
                                            step.status === 'running' ? 'bg-purple-500/20 text-purple-400' :
                                                step.status === 'error' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-white/10 text-gray-500'
                                        }`}>
                                        {step.status === 'running' ? <Loader2 className="w-5 h-5 animate-spin" /> :
                                            step.status === 'complete' ? <CheckCircle className="w-5 h-5" /> :
                                                step.status === 'error' ? <AlertCircle className="w-5 h-5" /> :
                                                    getStepIcon(step.step)}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-white">{getStepTitle(step.step)}</h3>
                                        <p className="text-xs text-gray-400">
                                            {step.status === 'pending' ? 'Waiting...' :
                                                step.status === 'running' ? 'Processing...' :
                                                    step.status === 'complete' ? 'Complete' :
                                                        'Error'}
                                        </p>
                                    </div>
                                </div>
                                <span className={`text-xs font-medium px-3 py-1 rounded-full ${step.status === 'complete' ? 'bg-green-500/20 text-green-400' :
                                        step.status === 'running' ? 'bg-purple-500/20 text-purple-400' :
                                            step.status === 'error' ? 'bg-red-500/20 text-red-400' :
                                                'bg-white/10 text-gray-500'
                                    }`}>
                                    Step {index + 1}/4
                                </span>
                            </div>

                            {/* Step Details */}
                            {step.status === 'complete' && step.data && (
                                <div className="px-4 pb-4">
                                    <details className="group">
                                        <summary className="cursor-pointer text-sm text-gray-400 hover:text-white transition">
                                            View details
                                        </summary>
                                        <pre className="mt-3 bg-black/50 p-4 rounded-lg text-xs text-gray-400 overflow-x-auto max-h-48">
                                            {JSON.stringify(step.data, null, 2)}
                                        </pre>
                                    </details>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Final Report */}
                {finalReport && (
                    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-white/10">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    Analysis Complete
                                </h3>
                                <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${finalReport.confidence_level === 'High' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                        finalReport.confidence_level === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                            'bg-red-500/20 text-red-400 border border-red-500/30'
                                    }`}>
                                    {finalReport.confidence_level} Confidence
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Score */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-400">Synthetic Probability</span>
                                    <span className="text-4xl font-bold text-white">{finalReport.synthetic_probability}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                                    <div
                                        className={`h-4 rounded-full transition-all duration-1000 ${finalReport.synthetic_probability > 70 ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                                                finalReport.synthetic_probability > 40 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                                    'bg-gradient-to-r from-green-500 to-emerald-500'
                                            }`}
                                        style={{ width: `${finalReport.synthetic_probability}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    {finalReport.synthetic_probability > 70 ? 'High likelihood of AI generation' :
                                        finalReport.synthetic_probability > 40 ? 'Some indicators of synthetic origin' :
                                            'Appears to be authentic human-created content'}
                                </p>
                            </div>

                            {/* Breakdown */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-white/5 rounded-xl text-center">
                                    <div className="text-3xl font-bold text-purple-400">{finalReport.breakdown.filename_score}</div>
                                    <div className="text-xs text-gray-400 mt-1">Filename Score</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl text-center">
                                    <div className="text-3xl font-bold text-cyan-400">{finalReport.breakdown.metadata_score}</div>
                                    <div className="text-xs text-gray-400 mt-1">Metadata Score</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl text-center">
                                    <div className="text-3xl font-bold text-pink-400">{finalReport.breakdown.c2pa_score}</div>
                                    <div className="text-xs text-gray-400 mt-1">C2PA Score</div>
                                </div>
                            </div>

                            {/* Download Button */}
                            <div className="flex justify-center pt-4">
                                <button
                                    onClick={downloadPDF}
                                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
                                >
                                    <Download className="w-5 h-5" /> Download Report as PDF
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
