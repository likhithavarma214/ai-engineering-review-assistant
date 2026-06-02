export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string;
  languages: Record<string, number>;
  openIssues: number;
  watchers: number;
  size: number;
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
  topics: string[];
  license: string | null;
  hasCI: boolean;
  hasDocker: boolean;
  hasTests: boolean;
  readme: string;
  packageJson: Record<string, any> | null;
  owner: {
    login: string;
    avatarUrl: string;
  };
}

export interface Scores {
  architecture: number;
  security: number;
  cloudReadiness: number;
  maintainability: number;
  performance: number;
  overall: number;
}

export interface AgentReview {
  agentName: string;
  category: string;
  score: number;
  summary: string;
  findings: Finding[];
  recommendations: string[];
}

export interface Finding {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  category: string;
}

export interface InterviewQuestion {
  id: number;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expectedAnswer: string;
  followUp: string;
}

export interface ResumeBullet {
  id: number;
  bullet: string;
  category: string;
  impact: string;
}

export interface Analysis {
  id: string;
  repository: Repository;
  scores: Scores;
  reviews: {
    architecture: AgentReview;
    security: AgentReview;
    cloud: AgentReview;
    performance: AgentReview;
  };
  interviewQuestions: InterviewQuestion[];
  resumeBullets: ResumeBullet[];
  createdAt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processingStep: string;
}

export interface AnalysisHistory {
  id: string;
  repoName: string;
  repoUrl: string;
  overallScore: number;
  createdAt: string;
  language: string;
  stars: number;
}

export type AgentType = 'architecture' | 'security' | 'cloud' | 'performance' | 'interview' | 'resume';

export interface AgentStatus {
  agent: AgentType;
  status: 'idle' | 'running' | 'completed' | 'failed';
  progress: number;
  message: string;
}
