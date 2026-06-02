import type { Analysis, AnalysisHistory } from '../types';

const STORAGE_KEY = 'ai_review_analyses';
const HISTORY_KEY = 'ai_review_history';

export function saveAnalysis(analysis: Analysis): void {
  const analyses = getAnalyses();
  analyses.unshift(analysis);
  // Keep max 50
  if (analyses.length > 50) analyses.length = 50;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
  updateHistory(analysis);
}

export function getAnalyses(): Analysis[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getAnalysisById(id: string): Analysis | null {
  const analyses = getAnalyses();
  return analyses.find(a => a.id === id) || null;
}

export function deleteAnalysis(id: string): void {
  const analyses = getAnalyses().filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
  const history = getHistory().filter(h => h.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function updateHistory(analysis: Analysis): void {
  const history = getHistory();
  const entry: AnalysisHistory = {
    id: analysis.id,
    repoName: analysis.repository.fullName,
    repoUrl: analysis.repository.url,
    overallScore: analysis.scores.overall,
    createdAt: analysis.createdAt,
    language: analysis.repository.language,
    stars: analysis.repository.stars,
  };
  history.unshift(entry);
  if (history.length > 50) history.length = 50;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getHistory(): AnalysisHistory[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
