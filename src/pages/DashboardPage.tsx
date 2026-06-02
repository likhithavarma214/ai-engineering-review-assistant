import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Download, ArrowLeft, Cpu, Shield, Cloud, Zap, Wrench,
  Trophy, BarChart3
} from 'lucide-react';
import type { Analysis } from '../types';
import { getAnalysisById } from '../services/storage';
import { generatePDF } from '../services/pdfExport';
import ScoreCard from '../components/ScoreCard';
import RadarChartComponent from '../components/RadarChart';
import LanguageChart from '../components/LanguageChart';
import RepoInfo from '../components/RepoInfo';
import ReviewSection from '../components/ReviewSection';
import InterviewQuestionsComponent from '../components/InterviewQuestions';
import ResumeBulletsComponent from '../components/ResumeBullets';

type Tab = 'overview' | 'reviews' | 'interview' | 'resume';

interface DashboardPageProps {
  currentAnalysis: Analysis | null;
}

export default function DashboardPage({ currentAnalysis }: DashboardPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  useEffect(() => {
    if (currentAnalysis && currentAnalysis.id === id) {
      setAnalysis(currentAnalysis);
    } else if (id) {
      const stored = getAnalysisById(id);
      if (stored) {
        setAnalysis(stored);
      } else {
        navigate('/analyze');
      }
    }
  }, [id, currentAnalysis, navigate]);

  if (!analysis) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-dark-300 text-lg">Loading analysis...</div>
      </div>
    );
  }

  const { repository, scores, reviews, interviewQuestions, resumeBullets } = analysis;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'reviews', label: 'Reviews', icon: <Cpu className="w-4 h-4" /> },
    { id: 'interview', label: 'Interview', icon: <span className="text-sm">🎯</span> },
    { id: 'resume', label: 'Resume', icon: <span className="text-sm">📝</span> },
  ];

  const getOverallScoreColor = () => {
    if (scores.overall >= 80) return 'from-emerald-500 to-emerald-400';
    if (scores.overall >= 65) return 'from-cyan-500 to-cyan-400';
    if (scores.overall >= 50) return 'from-amber-500 to-amber-400';
    return 'from-red-500 to-red-400';
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/analyze')}
              className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-dark-200 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">{repository.fullName}</h1>
              <p className="text-xs text-dark-300">
                Analyzed on {new Date(analysis.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => generatePDF(analysis)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all cursor-pointer text-sm"
          >
            <Download className="w-4 h-4" />
            Export PDF Report
          </button>
        </div>

        {/* Overall Score Banner */}
        <div className="glass-card rounded-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${getOverallScoreColor()} flex items-center justify-center`}>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{scores.overall}</div>
                  <div className="text-xs text-white/80 font-medium">/ 100</div>
                </div>
              </div>
              <Trophy className="absolute -top-2 -right-2 w-7 h-7 text-amber-400 drop-shadow-lg" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-xl font-bold text-white mb-1">Overall Engineering Score</h2>
              <p className="text-sm text-dark-200">
                {scores.overall >= 80
                  ? 'Excellent engineering practices. This codebase demonstrates strong architecture, security, and performance patterns.'
                  : scores.overall >= 65
                  ? 'Good engineering foundation with room for improvement in some areas. Review recommendations for optimization opportunities.'
                  : scores.overall >= 50
                  ? 'Average engineering maturity. Several areas need attention to meet production-grade standards.'
                  : 'Significant improvements needed across multiple dimensions. Focus on the critical findings first.'}
              </p>
            </div>
            <div className="hidden lg:grid grid-cols-5 gap-3">
              {[
                { label: 'Arch', value: scores.architecture, icon: '🏗️' },
                { label: 'Sec', value: scores.security, icon: '🔒' },
                { label: 'Cloud', value: scores.cloudReadiness, icon: '☁️' },
                { label: 'Maint', value: scores.maintainability, icon: '🔧' },
                { label: 'Perf', value: scores.performance, icon: '⚡' },
              ].map(s => (
                <div key={s.label} className="text-center p-2 rounded-lg bg-dark-700/50">
                  <div className="text-lg mb-0.5">{s.icon}</div>
                  <div className={`text-lg font-bold ${
                    s.value >= 80 ? 'text-score-excellent' :
                    s.value >= 65 ? 'text-score-good' :
                    s.value >= 50 ? 'text-score-average' : 'text-score-poor'
                  }`}>{s.value}%</div>
                  <div className="text-xs text-dark-300">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all cursor-pointer border ${
                activeTab === tab.id
                  ? 'tab-active'
                  : 'bg-dark-700/50 border-dark-500/30 text-dark-200 hover:text-white hover:border-dark-400/50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Score Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <ScoreCard
                label="Architecture"
                score={scores.architecture}
                icon={<Cpu className="w-4 h-4 text-white" />}
                color="from-indigo-500 to-indigo-600"
                delay={0}
              />
              <ScoreCard
                label="Security"
                score={scores.security}
                icon={<Shield className="w-4 h-4 text-white" />}
                color="from-red-500 to-red-600"
                delay={100}
              />
              <ScoreCard
                label="Cloud Ready"
                score={scores.cloudReadiness}
                icon={<Cloud className="w-4 h-4 text-white" />}
                color="from-cyan-500 to-cyan-600"
                delay={200}
              />
              <ScoreCard
                label="Maintainability"
                score={scores.maintainability}
                icon={<Wrench className="w-4 h-4 text-white" />}
                color="from-purple-500 to-purple-600"
                delay={300}
              />
              <ScoreCard
                label="Performance"
                score={scores.performance}
                icon={<Zap className="w-4 h-4 text-white" />}
                color="from-amber-500 to-amber-600"
                delay={400}
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RadarChartComponent scores={scores} />
              <LanguageChart languages={repository.languages} />
            </div>

            {/* Repo Info */}
            <RepoInfo repository={repository} />

            {/* Quick Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-card rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Strengths
                </h3>
                <ul className="space-y-2">
                  {Object.entries(scores)
                    .filter(([key, val]) => key !== 'overall' && val >= 70)
                    .slice(0, 3)
                    .map(([key, val]) => (
                      <li key={key} className="flex items-center gap-2 text-sm text-dark-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="ml-auto text-xs text-emerald-400 font-medium">{val}%</span>
                      </li>
                    ))}
                  {repository.hasCI && (
                    <li className="flex items-center gap-2 text-sm text-dark-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      CI/CD Pipeline Configured
                    </li>
                  )}
                  {repository.hasDocker && (
                    <li className="flex items-center gap-2 text-sm text-dark-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Docker Containerization
                    </li>
                  )}
                </ul>
              </div>
              <div className="glass-card rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-amber-400">⚠</span> Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {Object.entries(scores)
                    .filter(([key, val]) => key !== 'overall' && val < 70)
                    .slice(0, 3)
                    .map(([key, val]) => (
                      <li key={key} className="flex items-center gap-2 text-sm text-dark-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="ml-auto text-xs text-amber-400 font-medium">{val}%</span>
                      </li>
                    ))}
                  {!repository.hasCI && (
                    <li className="flex items-center gap-2 text-sm text-dark-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      No CI/CD Pipeline Detected
                    </li>
                  )}
                  {!repository.hasDocker && (
                    <li className="flex items-center gap-2 text-sm text-dark-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      No Containerization
                    </li>
                  )}
                  {!repository.hasTests && (
                    <li className="flex items-center gap-2 text-sm text-dark-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      Limited Test Coverage
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <ReviewSection
              review={reviews.architecture}
              icon="🏗️"
              color="from-indigo-500 to-indigo-600"
            />
            <ReviewSection
              review={reviews.security}
              icon="🔒"
              color="from-red-500 to-red-600"
            />
            <ReviewSection
              review={reviews.cloud}
              icon="☁️"
              color="from-cyan-500 to-cyan-600"
            />
            <ReviewSection
              review={reviews.performance}
              icon="⚡"
              color="from-amber-500 to-amber-600"
            />
          </div>
        )}

        {activeTab === 'interview' && (
          <InterviewQuestionsComponent questions={interviewQuestions} />
        )}

        {activeTab === 'resume' && (
          <ResumeBulletsComponent bullets={resumeBullets} />
        )}
      </div>
    </div>
  );
}
