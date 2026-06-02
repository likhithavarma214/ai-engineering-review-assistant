import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, AlertCircle, Info, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { AgentReview, Finding } from '../types';

interface ReviewSectionProps {
  review: AgentReview;
  icon: string;
  color: string;
}

function SeverityBadge({ severity }: { severity: Finding['severity'] }) {
  const config = {
    critical: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30', icon: ShieldAlert },
    high: { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30', icon: AlertTriangle },
    medium: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', icon: AlertCircle },
    low: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30', icon: Info },
    info: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: ShieldCheck },
  };

  const c = config[severity];
  const Icon = c.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${c.bg} ${c.text} border ${c.border}`}>
      <Icon className="w-3 h-3" />
      {severity.toUpperCase()}
    </span>
  );
}

export default function ReviewSection({ review, icon, color }: ReviewSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [showFindings, setShowFindings] = useState(true);

  const criticalCount = review.findings.filter(f => f.severity === 'critical' || f.severity === 'high').length;

  return (
    <div className="glass-card rounded-xl overflow-hidden animate-fade-in-up">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-dark-600/30 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-xl`}>
            {icon}
          </div>
          <div className="text-left">
            <h3 className="text-base font-semibold text-white">{review.agentName}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-sm font-bold ${
                review.score >= 80 ? 'text-score-excellent' :
                review.score >= 65 ? 'text-score-good' :
                review.score >= 50 ? 'text-score-average' : 'text-score-poor'
              }`}>
                Score: {review.score}%
              </span>
              {criticalCount > 0 && (
                <span className="text-xs text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">
                  {criticalCount} critical/high
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1">
            {review.findings.slice(0, 4).map((f, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  f.severity === 'critical' ? 'bg-red-400' :
                  f.severity === 'high' ? 'bg-orange-400' :
                  f.severity === 'medium' ? 'bg-amber-400' :
                  f.severity === 'low' ? 'bg-blue-400' : 'bg-emerald-400'
                }`}
              />
            ))}
          </div>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-dark-300" />
          ) : (
            <ChevronDown className="w-5 h-5 text-dark-300" />
          )}
        </div>
      </button>

      {/* Body */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-dark-600/50">
          {/* Summary */}
          <div className="mt-4 p-4 rounded-lg bg-dark-700/50 border border-dark-500/30">
            <p className="text-sm text-dark-100 leading-relaxed">{review.summary}</p>
          </div>

          {/* Findings Toggle */}
          <div className="mt-5">
            <button
              onClick={() => setShowFindings(!showFindings)}
              className="flex items-center gap-2 text-sm font-semibold text-dark-100 mb-3 cursor-pointer"
            >
              <span>Findings ({review.findings.length})</span>
              {showFindings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showFindings && (
              <div className="space-y-3">
                {review.findings.map((finding, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-dark-700/30 border border-dark-500/20 hover:border-dark-400/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="text-sm font-medium text-white">{finding.title}</h4>
                      <SeverityBadge severity={finding.severity} />
                    </div>
                    <p className="text-xs text-dark-200 leading-relaxed">{finding.description}</p>
                    <span className="inline-block mt-2 text-xs text-dark-300 bg-dark-600/50 px-2 py-0.5 rounded">
                      {finding.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="mt-5">
            <h4 className="text-sm font-semibold text-dark-100 mb-3">Recommendations</h4>
            <div className="space-y-2">
              {review.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-dark-200">
                  <span className="text-indigo-400 mt-0.5 shrink-0">▸</span>
                  <span className="leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
