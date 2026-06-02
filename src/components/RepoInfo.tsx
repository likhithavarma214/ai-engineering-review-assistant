import { Star, GitFork, Eye, AlertCircle, Calendar, Scale, ExternalLink, Tag } from 'lucide-react';
import type { Repository } from '../types';

interface RepoInfoProps {
  repository: Repository;
}

export default function RepoInfo({ repository }: RepoInfoProps) {
  return (
    <div className="glass-card rounded-xl p-6 animate-fade-in-up">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={repository.owner.avatarUrl}
            alt={repository.owner.login}
            className="w-12 h-12 rounded-xl border-2 border-dark-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${repository.owner.login}&background=6366f1&color=fff&size=48`;
            }}
          />
          <div>
            <h3 className="text-lg font-bold text-white">{repository.fullName}</h3>
            <p className="text-sm text-dark-200 mt-0.5 max-w-lg">{repository.description}</p>
          </div>
        </div>
        <a
          href={repository.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-600/50 text-dark-200 hover:text-white hover:bg-dark-500 text-xs font-medium transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">View on GitHub</span>
        </a>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-dark-700/40">
          <Star className="w-4 h-4 text-amber-400" />
          <div>
            <div className="text-sm font-semibold text-white">{repository.stars.toLocaleString()}</div>
            <div className="text-xs text-dark-300">Stars</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-dark-700/40">
          <GitFork className="w-4 h-4 text-cyan-400" />
          <div>
            <div className="text-sm font-semibold text-white">{repository.forks.toLocaleString()}</div>
            <div className="text-xs text-dark-300">Forks</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-dark-700/40">
          <Eye className="w-4 h-4 text-purple-400" />
          <div>
            <div className="text-sm font-semibold text-white">{repository.watchers.toLocaleString()}</div>
            <div className="text-xs text-dark-300">Watchers</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-dark-700/40">
          <AlertCircle className="w-4 h-4 text-orange-400" />
          <div>
            <div className="text-sm font-semibold text-white">{repository.openIssues.toLocaleString()}</div>
            <div className="text-xs text-dark-300">Issues</div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2 text-dark-200">
          <span className="font-medium text-dark-100">Language:</span>
          <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 font-medium">{repository.language}</span>
        </div>
        <div className="flex items-center gap-2 text-dark-200">
          <Scale className="w-3.5 h-3.5" />
          <span className="font-medium text-dark-100">License:</span>
          <span>{repository.license || 'Not specified'}</span>
        </div>
        <div className="flex items-center gap-2 text-dark-200">
          <Calendar className="w-3.5 h-3.5" />
          <span className="font-medium text-dark-100">Created:</span>
          <span>{new Date(repository.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-dark-200">
          <Calendar className="w-3.5 h-3.5" />
          <span className="font-medium text-dark-100">Updated:</span>
          <span>{new Date(repository.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Topics */}
      {repository.topics.length > 0 && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <Tag className="w-3.5 h-3.5 text-dark-300" />
          {repository.topics.map(topic => (
            <span
              key={topic}
              className="px-2 py-0.5 rounded-full text-xs bg-dark-600/50 text-dark-200 border border-dark-500/30"
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      {/* Feature badges */}
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        {repository.hasCI && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            ✓ CI/CD
          </span>
        )}
        {repository.hasDocker && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            ✓ Docker
          </span>
        )}
        {repository.hasTests && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20">
            ✓ Tests
          </span>
        )}
      </div>
    </div>
  );
}
