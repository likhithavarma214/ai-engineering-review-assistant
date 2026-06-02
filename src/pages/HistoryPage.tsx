import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Trash2, ExternalLink, GitBranch, Search, Star, ArrowRight, AlertCircle } from 'lucide-react';
import type { AnalysisHistory } from '../types';
import { getHistory, deleteAnalysis } from '../services/storage';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const filtered = history.filter(h =>
    h.repoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    deleteAnalysis(id);
    setHistory(getHistory());
    setDeleteConfirm(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-score-excellent bg-emerald-500/10 border-emerald-500/30';
    if (score >= 65) return 'text-score-good bg-cyan-500/10 border-cyan-500/30';
    if (score >= 50) return 'text-score-average bg-amber-500/10 border-amber-500/30';
    return 'text-score-poor bg-red-500/10 border-red-500/30';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-emerald-400';
    if (score >= 65) return 'from-cyan-500 to-cyan-400';
    if (score >= 50) return 'from-amber-500 to-amber-400';
    return 'from-red-500 to-red-400';
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <History className="w-5 h-5 text-indigo-400" />
              <h1 className="text-2xl font-bold text-white">Analysis History</h1>
            </div>
            <p className="text-sm text-dark-200">
              {history.length} {history.length === 1 ? 'analysis' : 'analyses'} performed
            </p>
          </div>
          <button
            onClick={() => navigate('/analyze')}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all cursor-pointer text-sm"
          >
            New Analysis
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        {history.length > 0 && (
          <div className="relative mb-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-300" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by repository name or language..."
              className="w-full bg-dark-700 border border-dark-500 rounded-xl py-3 pl-10 pr-4 text-white placeholder-dark-300 outline-none focus:border-indigo-500/50 transition-colors text-sm"
            />
          </div>
        )}

        {/* Empty State */}
        {history.length === 0 && (
          <div className="glass-card rounded-2xl p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-dark-600 mx-auto mb-5 flex items-center justify-center">
              <History className="w-8 h-8 text-dark-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Analyses Yet</h3>
            <p className="text-sm text-dark-200 mb-6 max-w-md mx-auto">
              Start by analyzing a GitHub repository. Your analysis history will appear here
              for quick reference and comparison.
            </p>
            <button
              onClick={() => navigate('/analyze')}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all cursor-pointer text-sm"
            >
              Analyze Repository
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* No Results */}
        {history.length > 0 && filtered.length === 0 && (
          <div className="glass-card rounded-xl p-10 text-center">
            <AlertCircle className="w-8 h-8 text-dark-300 mx-auto mb-3" />
            <p className="text-dark-200">No analyses matching "{searchTerm}"</p>
          </div>
        )}

        {/* History List */}
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-xl p-5 group hover:border-indigo-500/30 transition-all"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Score Circle */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getScoreBg(item.overallScore)} flex items-center justify-center shrink-0`}>
                    <span className="text-lg font-bold text-white">{item.overallScore}</span>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <GitBranch className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <h3 className="text-sm font-semibold text-white truncate">
                        {item.repoName}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-dark-300">
                      <span className="px-1.5 py-0.5 rounded bg-dark-600/50 text-dark-200">
                        {item.language}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400" />
                        {item.stars.toLocaleString()}
                      </span>
                      <span>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className={`px-3 py-1 rounded-lg text-xs font-bold border ${getScoreColor(item.overallScore)}`}>
                    {item.overallScore >= 80 ? 'Excellent' : item.overallScore >= 65 ? 'Good' : item.overallScore >= 50 ? 'Average' : 'Needs Work'}
                  </div>

                  <button
                    onClick={() => navigate(`/dashboard/${item.id}`)}
                    className="p-2 rounded-lg bg-dark-600/50 hover:bg-indigo-500/20 text-dark-300 hover:text-indigo-300 transition-all cursor-pointer"
                    title="View Dashboard"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  {deleteConfirm === item.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors cursor-pointer"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-2 py-1 rounded text-xs bg-dark-600 text-dark-200 hover:text-white transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(item.id)}
                      className="p-2 rounded-lg bg-dark-600/50 hover:bg-red-500/15 text-dark-400 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
