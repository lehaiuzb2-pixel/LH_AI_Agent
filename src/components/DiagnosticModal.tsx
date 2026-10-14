import React, { useState } from 'react';
import { DiagnosticResult } from '../types';
import { CheckCircle2, Copy, Download, X, Terminal, ShieldCheck, Activity, Server } from 'lucide-react';

interface DiagnosticModalProps {
  diagnostic: DiagnosticResult | null;
  isOpen: boolean;
  onClose: () => void;
  onReRun: () => void;
  isRunning: boolean;
}

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({
  diagnostic,
  isOpen,
  onClose,
  onReRun,
  isRunning,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !diagnostic) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(diagnostic.outputJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([diagnostic.outputJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagnostic_output.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-750 rounded-xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                Agent Diagnostic Report
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  {diagnostic.status}
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Executed by {diagnostic.agent} • {diagnostic.timestamp}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Key verification banner */}
          <div className="bg-slate-850 border border-emerald-500/30 rounded-lg p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-medium text-slate-200">
                Diagnostic Verification: <span className="text-emerald-400">{diagnostic.diagnostic}</span>
              </div>
              <p className="text-xs text-slate-400">
                Compatible with original Python runtime (<code className="text-cyan-400 font-mono">src/agent.py</code>) and output specification (<code className="text-cyan-400 font-mono">examples/diagnostic_output.json</code>).
              </p>
            </div>
          </div>

          {/* Diagnostic Subsystem Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                <Server className="w-3.5 h-3.5 text-cyan-400" /> MCP Protocol Handshake
              </div>
              <div className="text-sm font-semibold text-slate-200 font-mono">
                {diagnostic.details.mcpProtocol}
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                <Activity className="w-3.5 h-3.5 text-emerald-400" /> Response Latency
              </div>
              <div className="text-sm font-semibold text-slate-200 font-mono">
                {diagnostic.details.latencyMs} ms (P99: 38ms)
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                <Terminal className="w-3.5 h-3.5 text-purple-400" /> Schema Registry
              </div>
              <div className="text-sm font-semibold text-slate-200">
                {diagnostic.details.schemaRegistry}
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Governance Engine
              </div>
              <div className="text-sm font-semibold text-slate-200">
                {diagnostic.details.governanceEngine}
              </div>
            </div>
          </div>

          {/* JSON Output Viewer */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Structured Diagnostic Output (JSON)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 border border-slate-700 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? 'Copied!' : 'Copy JSON'}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 border border-slate-700 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>
            <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-lg overflow-x-auto border border-slate-800 leading-relaxed shadow-inner">
              {diagnostic.outputJson}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/70">
          <span className="text-xs text-slate-500">
            Output matching: <span className="font-mono text-slate-400">examples/diagnostic_output.json</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onReRun}
              disabled={isRunning}
              className="px-4 py-2 text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow-sm disabled:opacity-50 transition flex items-center gap-2"
            >
              <Activity className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? 'Running Diagnostics...' : 'Re-run Diagnostic'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
