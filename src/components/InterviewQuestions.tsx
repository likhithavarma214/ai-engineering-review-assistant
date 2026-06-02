import { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import type { InterviewQuestion } from '../types';

interface InterviewQuestionsProps {
  questions: InterviewQuestion[];
}

function DifficultyBadge({ difficulty }: { difficulty: InterviewQuestion['difficulty'] }) {
  const config = {
    easy: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    hard: 'bg-red-500/15 text-red-400 border-red-500/30',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${config[difficulty]}`}>
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </span>
  );
}

export default function InterviewQuestionsComponent({ questions }: InterviewQuestionsProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(questions.map(q => q.category)))];
  const filtered = filter === 'all' ? questions : questions.filter(q => q.category === filter);

  return (
    <div className="glass-card rounded-xl p-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-indigo-400" />
          Interview Questions
        </h3>
        <span className="text-xs text-dark-300 bg-dark-600/50 px-2 py-1 rounded-full">
          {questions.length} questions
        </span>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filter === cat
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'bg-dark-600/40 text-dark-200 border border-dark-500/30 hover:border-dark-400/50'
            }`}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filtered.map(q => (
          <div
            key={q.id}
            className="rounded-lg border border-dark-500/30 overflow-hidden bg-dark-700/20 hover:border-dark-400/40 transition-colors"
          >
            <button
              onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
              className="w-full flex items-start justify-between p-4 text-left cursor-pointer"
            >
              <div className="flex-1 pr-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs text-dark-300 font-medium">Q{q.id}</span>
                  <span className="text-xs text-dark-400">•</span>
                  <span className="text-xs text-indigo-300">{q.category}</span>
                  <DifficultyBadge difficulty={q.difficulty} />
                </div>
                <p className="text-sm text-white font-medium leading-relaxed">{q.question}</p>
              </div>
              {expandedId === q.id ? (
                <ChevronUp className="w-4 h-4 text-dark-300 mt-1 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-dark-300 mt-1 shrink-0" />
              )}
            </button>

            {expandedId === q.id && (
              <div className="px-4 pb-4 border-t border-dark-500/20">
                <div className="mt-3 p-3 rounded-lg bg-dark-700/50">
                  <h5 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1.5">
                    Expected Answer
                  </h5>
                  <p className="text-xs text-dark-100 leading-relaxed">{q.expectedAnswer}</p>
                </div>
                <div className="mt-2 p-3 rounded-lg bg-dark-700/50">
                  <h5 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1.5">
                    Follow-up Question
                  </h5>
                  <p className="text-xs text-dark-100 leading-relaxed italic">"{q.followUp}"</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
