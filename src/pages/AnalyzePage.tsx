import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { GitBranch, ArrowRight, AlertCircle, ChevronRight } from 'lucide-react';
import { analyzeRepository } from '../services/analysisEngine';
import { saveAnalysis } from '../services/storage';
import AnalysisProgress from '../components/AnalysisProgress';
import type { Analysis } from '../types';

interface AnalyzePageProps {
  onAnalysisComplete: (analysis: Analysis) => void;
}

export default function AnalyzePage({ onAnalysisComplete }: AnalyzePageProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [repoUrl, setRepoUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStep, setProgressStep] = useState('');
  const [error, setError] = useState('');

  const startAnalysis = useCallback(async (url: string) => {
    if (!url.trim() || !url.includes('github.com/')) {
      setError('Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo)');
      return;
    }

    setError('');
    setIsAnalyzing(true);
    setProgress(0);
    setProgressStep('Initializing analysis...');

    try {
      const analysis = await analyzeRepository(url, (step, prog) => {
        setProgressStep(step);
        setProgress(prog);
      });

      saveAnalysis(analysis);
      onAnalysisComplete(analysis);
      navigate(`/dashboard/${analysis.id}`);
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please try again.');
      setIsAnalyzing(false);
    }
  }, [navigate, onAnalysisComplete]);

  useEffect(() => {
    const repoParam = searchParams.get('repo');
    if (repoParam) {
      setRepoUrl(repoParam);
      startAnalysis(repoParam);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startAnalysis(repoUrl);
  };

  const exampleRepos = [
    { url: 'https://github.com/facebook/react', name: 'facebook/react', lang: 'JavaScript' },
    { url: 'https://github.com/vercel/next.js', name: 'vercel/next.js', lang: 'JavaScript' },
    { url: 'https://github.com/microsoft/vscode', name: 'microsoft/vscode', lang: 'TypeScript' },
    { url: 'https://github.com/tensorflow/tensorflow', name: 'tensorflow/tensorflow', lang: 'Python' },
    { url: 'https://github.com/golang/go', name: 'golang/go', lang: 'Go' },
    { url: 'https://github.com/rust-lang/rust', name: 'rust-lang/rust', lang: 'Rust' },
    { url: 'https://github.com/django/django', name: 'django/django', lang: 'Python' },
    { url: 'https://github.com/spring-projects/spring-boot', name: 'spring-projects/spring-boot', lang: 'Java' },
  ];

  return (
    <>
      {isAnalyzing && <AnalysisProgress step={progressStep} progress={progress} />}

      <div className="min-h-screen bg-dark-900 pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-5">
              <GitBranch className="w-4 h-4" />
              Repository Analysis
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Analyze a GitHub Repository
            </h1>
            <p className="text-dark-200 max-w-xl mx-auto">
              Enter a GitHub repository URL to run a comprehensive AI-powered engineering review
              across architecture, security, cloud readiness, and performance.
            </p>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="mb-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center bg-dark-700 border border-dark-500 rounded-xl overflow-hidden focus-within:border-indigo-500/50 transition-colors">
                <div className="pl-5 pr-2">
                  <GitBranch className="w-5 h-5 text-dark-300" />
                </div>
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => {
                    setRepoUrl(e.target.value);
                    setError('');
                  }}
                  placeholder="https://github.com/owner/repository"
                  className="flex-1 bg-transparent py-4 px-2 text-white placeholder-dark-300 outline-none text-base"
                  disabled={isAnalyzing}
                />
                <button
                  type="submit"
                  disabled={!repoUrl.trim() || isAnalyzing}
                  className="m-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:from-dark-500 disabled:to-dark-500 text-white font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  Analyze
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </form>

          {/* Example Repos */}
          <div>
            <h3 className="text-sm font-semibold text-dark-200 uppercase tracking-wider mb-4">
              Popular Repositories to Analyze
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {exampleRepos.map(repo => (
                <button
                  key={repo.url}
                  onClick={() => {
                    setRepoUrl(repo.url);
                    startAnalysis(repo.url);
                  }}
                  disabled={isAnalyzing}
                  className="glass-card rounded-xl p-4 flex items-center justify-between group hover:border-indigo-500/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-dark-600 flex items-center justify-center">
                      <GitBranch className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">
                        {repo.name}
                      </div>
                      <div className="text-xs text-dark-300">{repo.lang}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-dark-400 group-hover:text-indigo-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
            <div className="glass-card rounded-xl p-5">
              <div className="text-xl mb-2">🏗️</div>
              <h4 className="text-sm font-semibold text-white mb-1">Architecture</h4>
              <p className="text-xs text-dark-300">Code structure, patterns, dependencies, and design decisions</p>
            </div>
            <div className="glass-card rounded-xl p-5">
              <div className="text-xl mb-2">🔒</div>
              <h4 className="text-sm font-semibold text-white mb-1">Security</h4>
              <p className="text-xs text-dark-300">Vulnerability scanning, secrets management, auth patterns</p>
            </div>
            <div className="glass-card rounded-xl p-5">
              <div className="text-xl mb-2">📊</div>
              <h4 className="text-sm font-semibold text-white mb-1">Scoring</h4>
              <p className="text-xs text-dark-300">Quantified scores across 5 engineering dimensions</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
