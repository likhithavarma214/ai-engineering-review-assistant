import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GitBranch, Shield, Cloud, Zap, FileText, MessageCircle,
  BarChart3, ArrowRight, Search, Cpu, ChevronRight, Star,
  Globe, Lock, Award
} from 'lucide-react';

export default function LandingPage() {
  const [repoUrl, setRepoUrl] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = () => {
    if (repoUrl.trim()) {
      navigate(`/analyze?repo=${encodeURIComponent(repoUrl.trim())}`);
    }
  };

  const features = [
    {
      icon: <Cpu className="w-6 h-6" />,
      title: 'Architecture Review',
      description: 'Deep analysis of code structure, design patterns, and architectural decisions using AI agents.',
      color: 'from-indigo-500 to-indigo-600',
      iconBg: 'bg-indigo-500/15 text-indigo-400',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Security Analysis',
      description: 'Comprehensive vulnerability scanning, dependency auditing, and security best practices review.',
      color: 'from-red-500 to-red-600',
      iconBg: 'bg-red-500/15 text-red-400',
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: 'Cloud Readiness',
      description: 'Evaluate containerization, scalability patterns, and cloud deployment maturity.',
      color: 'from-cyan-500 to-cyan-600',
      iconBg: 'bg-cyan-500/15 text-cyan-400',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Performance Profiling',
      description: 'Identify bottlenecks, caching opportunities, and optimization strategies.',
      color: 'from-amber-500 to-amber-600',
      iconBg: 'bg-amber-500/15 text-amber-400',
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Interview Questions',
      description: 'Auto-generated technical interview questions based on the project\'s tech stack and complexity.',
      color: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-500/15 text-purple-400',
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Resume Bullets',
      description: 'Generate impactful resume bullet points highlighting engineering achievements.',
      color: 'from-pink-500 to-pink-600',
      iconBg: 'bg-pink-500/15 text-pink-400',
    },
  ];

  const stats = [
    { label: 'AI Agents', value: '6', icon: Cpu },
    { label: 'Review Categories', value: '5', icon: BarChart3 },
    { label: 'Metrics Analyzed', value: '30+', icon: Search },
    { label: 'Export Formats', value: 'PDF', icon: FileText },
  ];

  const exampleRepos = [
    'https://github.com/facebook/react',
    'https://github.com/vercel/next.js',
    'https://github.com/microsoft/vscode',
    'https://github.com/tensorflow/tensorflow',
    'https://github.com/golang/go',
    'https://github.com/rust-lang/rust',
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto pt-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
              <Cpu className="w-4 h-4" />
              Powered by Multi-Agent AI Architecture
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              AI Engineering{' '}
              <span className="gradient-text">Review Assistant</span>
            </h1>

            <p className="text-lg sm:text-xl text-dark-200 max-w-2xl mx-auto mb-10 leading-relaxed">
              Analyze any GitHub repository with 6 specialized AI agents. Get architecture reviews,
              security audits, cloud readiness scores, performance insights, interview questions,
              and resume bullet points.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center bg-dark-700 border border-dark-500 rounded-xl overflow-hidden focus-within:border-indigo-500/50 transition-colors">
                  <div className="pl-4 pr-2">
                    <GitBranch className="w-5 h-5 text-dark-300" />
                  </div>
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                    placeholder="https://github.com/owner/repository"
                    className="flex-1 bg-transparent py-4 px-2 text-white placeholder-dark-300 outline-none text-base"
                  />
                  <button
                    onClick={handleAnalyze}
                    disabled={!repoUrl.trim()}
                    className="m-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:from-dark-500 disabled:to-dark-500 text-white font-semibold rounded-lg flex items-center gap-2 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <span className="hidden sm:inline">Analyze</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Example Repos */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
              <span className="text-xs text-dark-300">Try:</span>
              {exampleRepos.slice(0, 4).map(repo => {
                const name = repo.split('/').slice(-2).join('/');
                return (
                  <button
                    key={repo}
                    onClick={() => {
                      setRepoUrl(repo);
                      navigate(`/analyze?repo=${encodeURIComponent(repo)}`);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-dark-700/50 border border-dark-500/30 text-xs text-dark-200 hover:text-white hover:border-indigo-500/30 transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {name}
                  </button>
                );
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {stats.map(stat => (
                <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
                  <stat.icon className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-dark-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-4">
              6 AI Agents Working Together
            </h2>
            <p className="text-dark-200 max-w-lg mx-auto">
              Each agent specializes in a different aspect of engineering excellence,
              providing comprehensive analysis of your codebase.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="glass-card rounded-xl p-6 group hover:scale-[1.02] transition-all duration-300"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-dark-200 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-dark-200 max-w-lg mx-auto">
              Three simple steps to get a comprehensive engineering review
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                title: 'Enter Repository URL',
                description: 'Paste any GitHub repository URL to begin the analysis process.',
                icon: <Globe className="w-6 h-6" />,
                color: 'text-indigo-400',
              },
              {
                step: '02',
                title: 'AI Agents Analyze',
                description: '6 specialized agents analyze architecture, security, cloud, performance, and more.',
                icon: <Cpu className="w-6 h-6" />,
                color: 'text-cyan-400',
              },
              {
                step: '03',
                title: 'Get Your Report',
                description: 'Receive detailed scores, reviews, interview questions, resume bullets, and PDF export.',
                icon: <Award className="w-6 h-6" />,
                color: 'text-emerald-400',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-2xl glass-card mx-auto mb-5 flex items-center justify-center">
                  <span className={item.color}>{item.icon}</span>
                </div>
                <div className={`text-xs font-bold ${item.color} mb-2`}>STEP {item.step}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-dark-200 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scoring Showcase */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-4">Engineering Score Breakdown</h2>
            <p className="text-dark-200 max-w-lg mx-auto">
              Get quantified scores across 5 key engineering dimensions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {[
              { label: 'Architecture', icon: '🏗️', desc: 'Code structure & patterns', color: 'border-indigo-500/30' },
              { label: 'Security', icon: '🔒', desc: 'Vulnerability & compliance', color: 'border-red-500/30' },
              { label: 'Cloud Ready', icon: '☁️', desc: 'Deployment maturity', color: 'border-cyan-500/30' },
              { label: 'Maintainability', icon: '🔧', desc: 'Code quality & docs', color: 'border-purple-500/30' },
              { label: 'Performance', icon: '⚡', desc: 'Speed & efficiency', color: 'border-amber-500/30' },
            ].map(item => (
              <div key={item.label} className={`glass-card rounded-xl p-5 text-center border ${item.color}`}>
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="text-sm font-semibold text-white mb-1">{item.label}</div>
                <div className="text-xs text-dark-300">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-dark-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card rounded-2xl p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5" />
            <div className="relative">
              <Star className="w-10 h-10 text-indigo-400 mx-auto mb-5" />
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Review Your Repository?
              </h2>
              <p className="text-dark-200 max-w-lg mx-auto mb-8">
                Get comprehensive AI-powered engineering analysis in minutes.
                Architecture, security, cloud readiness, performance, and more.
              </p>
              <button
                onClick={() => navigate('/analyze')}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 text-base cursor-pointer"
              >
                Start Analysis
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <GitBranch className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold gradient-text">AI Review Assistant</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-dark-300">
              <Lock className="w-3.5 h-3.5" />
              <span>Your code is never stored. Analysis runs locally.</span>
            </div>
            <div className="text-xs text-dark-400">
              © {new Date().getFullYear()} AI Engineering Review Assistant
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
