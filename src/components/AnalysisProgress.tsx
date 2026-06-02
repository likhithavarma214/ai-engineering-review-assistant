import { Loader2, CheckCircle, Bot } from 'lucide-react';

interface AnalysisProgressProps {
  step: string;
  progress: number;
}

const AGENTS = [
  { name: 'Repository Fetcher', icon: '📦', threshold: 15 },
  { name: 'Architecture Agent', icon: '🏗️', threshold: 35 },
  { name: 'Security Agent', icon: '🔒', threshold: 50 },
  { name: 'Cloud Agent', icon: '☁️', threshold: 65 },
  { name: 'Performance Agent', icon: '⚡', threshold: 80 },
  { name: 'Interview & Resume', icon: '🎯', threshold: 95 },
  { name: 'Report Generator', icon: '📄', threshold: 100 },
];

export default function AnalysisProgress({ step, progress }: AnalysisProgressProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/90 backdrop-blur-sm">
      <div className="glass-card rounded-2xl p-8 max-w-lg w-full mx-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Analysis in Progress</h2>
            <p className="text-sm text-dark-200">Multi-agent system analyzing repository</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-dark-100 font-medium">{step}</span>
            <span className="text-sm font-bold text-indigo-400">{progress}%</span>
          </div>
          <div className="w-full bg-dark-600 rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 animate-gradient transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Agent Steps */}
        <div className="space-y-2.5">
          {AGENTS.map((agent, i) => {
            const isDone = progress >= agent.threshold;
            const isActive = !isDone && (i === 0 ? progress > 0 : progress >= AGENTS[i - 1].threshold);

            return (
              <div
                key={agent.name}
                className={`flex items-center gap-3 p-2.5 rounded-lg transition-all duration-300 ${
                  isActive ? 'bg-indigo-500/10 border border-indigo-500/30' :
                  isDone ? 'bg-dark-700/30' : 'opacity-40'
                }`}
              >
                <span className="text-lg">{agent.icon}</span>
                <span className={`text-sm font-medium flex-1 ${
                  isActive ? 'text-indigo-300' : isDone ? 'text-dark-100' : 'text-dark-300'
                }`}>
                  {agent.name}
                </span>
                {isDone ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-dark-400" />
                )}
              </div>
            );
          })}
        </div>

        {/* Tip */}
        <div className="mt-6 p-3 rounded-lg bg-dark-700/30 border border-dark-500/20">
          <p className="text-xs text-dark-300 text-center">
            💡 AI agents are analyzing architecture, security, cloud readiness, and performance patterns
          </p>
        </div>
      </div>
    </div>
  );
}
