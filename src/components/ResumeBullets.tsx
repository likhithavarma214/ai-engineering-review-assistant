import { useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import type { ResumeBullet } from '../types';

interface ResumeBulletsProps {
  bullets: ResumeBullet[];
}

export default function ResumeBulletsComponent({ bullets }: ResumeBulletsProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = async (bullet: ResumeBullet) => {
    try {
      await navigator.clipboard.writeText(bullet.bullet);
      setCopiedId(bullet.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Clipboard API might not be available
    }
  };

  const categoryColors: Record<string, string> = {
    Architecture: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    Security: 'text-red-400 bg-red-500/10 border-red-500/30',
    Cloud: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    Performance: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    Leadership: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    Engineering: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    DevOps: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    Overall: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
  };

  return (
    <div className="glass-card rounded-xl p-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-400" />
          Resume Bullet Points
        </h3>
        <span className="text-xs text-dark-300 bg-dark-600/50 px-2 py-1 rounded-full">
          {bullets.length} bullets
        </span>
      </div>

      <p className="text-xs text-dark-300 mb-4">
        Click the copy icon to copy individual bullet points to your clipboard.
      </p>

      <div className="space-y-3">
        {bullets.map(bullet => (
          <div
            key={bullet.id}
            className="group p-4 rounded-lg border border-dark-500/30 bg-dark-700/20 hover:border-indigo-500/30 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                    categoryColors[bullet.category] || 'text-dark-200 bg-dark-600/50 border-dark-500/30'
                  }`}>
                    {bullet.category}
                  </span>
                </div>
                <p className="text-sm text-white leading-relaxed">• {bullet.bullet}</p>
                <p className="text-xs text-dark-300 mt-2 italic">
                  Impact: {bullet.impact}
                </p>
              </div>
              <button
                onClick={() => handleCopy(bullet)}
                className="p-2 rounded-lg bg-dark-600/50 hover:bg-indigo-500/20 text-dark-300 hover:text-indigo-300 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shrink-0"
                title="Copy to clipboard"
              >
                {copiedId === bullet.id ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
