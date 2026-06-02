import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface ScoreCardProps {
  label: string;
  score: number;
  icon: ReactNode;
  color: string;
  delay?: number;
}

export default function ScoreCard({ label, score, icon, color, delay = 0 }: ScoreCardProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!visible) return;
    let current = 0;
    const step = score / 40;
    const interval = setInterval(() => {
      current += step;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(interval);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, 25);
    return () => clearInterval(interval);
  }, [score, visible]);

  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-score-excellent';
    if (s >= 65) return 'text-score-good';
    if (s >= 50) return 'text-score-average';
    return 'text-score-poor';
  };

  const getBarColor = (s: number) => {
    if (s >= 80) return 'from-emerald-500 to-emerald-400';
    if (s >= 65) return 'from-cyan-500 to-cyan-400';
    if (s >= 50) return 'from-amber-500 to-amber-400';
    return 'from-red-500 to-red-400';
  };

  return (
    <div
      className={`glass-card rounded-xl p-5 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
            {icon}
          </div>
          <span className="text-sm font-medium text-dark-100">{label}</span>
        </div>
        <span className={`text-2xl font-bold tabular-nums ${getScoreColor(displayScore)}`}>
          {displayScore}%
        </span>
      </div>
      <div className="w-full bg-dark-600 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getBarColor(score)} progress-bar`}
          style={{ width: visible ? `${score}%` : '0%' }}
        />
      </div>
      <div className="mt-2 text-xs text-dark-300">
        {score >= 80 ? 'Excellent' : score >= 65 ? 'Good' : score >= 50 ? 'Average' : 'Needs Improvement'}
      </div>
    </div>
  );
}
