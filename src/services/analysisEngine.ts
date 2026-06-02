import axios from "axios";
import type {
  Repository,
  Scores,
  AgentReview,
  Finding,
  InterviewQuestion,
  ResumeBullet,
  Analysis,
} from '../types';

function generateId(): string {
  return `analysis-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
}

const TECH_STACKS: Record<string, { languages: Record<string, number>; topics: string[] }> = {
  react: {
    languages: { TypeScript: 65, JavaScript: 20, CSS: 10, HTML: 5 },
    topics: ['react', 'frontend', 'ui', 'javascript', 'typescript'],
  },
  vue: {
    languages: { Vue: 55, JavaScript: 25, CSS: 15, HTML: 5 },
    topics: ['vue', 'frontend', 'javascript', 'spa'],
  },
  python: {
    languages: { Python: 78, Shell: 10, Dockerfile: 7, YAML: 5 },
    topics: ['python', 'backend', 'api', 'machine-learning'],
  },
  node: {
    languages: { TypeScript: 60, JavaScript: 25, Shell: 10, Dockerfile: 5 },
    topics: ['nodejs', 'backend', 'api', 'express'],
  },
  java: {
    languages: { Java: 75, XML: 10, Shell: 8, Dockerfile: 7 },
    topics: ['java', 'spring', 'backend', 'microservices'],
  },
  go: {
    languages: { Go: 80, Shell: 10, Dockerfile: 5, Makefile: 5 },
    topics: ['go', 'golang', 'backend', 'cloud-native'],
  },
  rust: {
    languages: { Rust: 85, Shell: 8, TOML: 4, Dockerfile: 3 },
    topics: ['rust', 'systems', 'performance', 'safety'],
  },
  default: {
    languages: { JavaScript: 50, TypeScript: 20, Python: 15, Shell: 10, Other: 5 },
    topics: ['open-source', 'development'],
  },
};

function detectStack(repoName: string): string {
  const name = repoName.toLowerCase();
  if (name.includes('react') || name.includes('next')) return 'react';
  if (name.includes('vue') || name.includes('nuxt')) return 'vue';
  if (name.includes('python') || name.includes('django') || name.includes('flask') || name.includes('fastapi')) return 'python';
  if (name.includes('node') || name.includes('express') || name.includes('nest')) return 'node';
  if (name.includes('java') || name.includes('spring') || name.includes('kotlin')) return 'java';
  if (name.includes('go') || name.includes('golang')) return 'go';
  if (name.includes('rust') || name.includes('cargo')) return 'rust';
  return 'default';
}

function generateRepository(owner: string, repo: string): Repository {
  const stack = detectStack(repo);
  const techInfo = TECH_STACKS[stack] || TECH_STACKS.default;
  const mainLang = Object.keys(techInfo.languages)[0];

  return {
    id: `repo-${Date.now()}`,
    name: repo,
    fullName: `${owner}/${repo}`,
    description: `${repo} - A modern ${mainLang} project with industry-standard architecture and best practices. Built for scalability and maintainability.`,
    url: `https://github.com/${owner}/${repo}`,
    stars: randomBetween(100, 85000),
    forks: randomBetween(20, 15000),
    language: mainLang,
    languages: techInfo.languages,
    openIssues: randomBetween(5, 500),
    watchers: randomBetween(50, 5000),
    size: randomBetween(1000, 500000),
    defaultBranch: 'main',
    createdAt: new Date(Date.now() - randomBetween(180, 2000) * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - randomBetween(0, 30) * 86400000).toISOString(),
    topics: techInfo.topics,
    license: ['MIT', 'Apache-2.0', 'BSD-3-Clause', 'GPL-3.0'][randomBetween(0, 3)],
    hasCI: Math.random() > 0.2,
    hasDocker: Math.random() > 0.3,
    hasTests: Math.random() > 0.2,
    readme: `# ${repo}\n\nA comprehensive ${mainLang} project following modern development practices.\n\n## Features\n- Modern architecture\n- Comprehensive testing\n- CI/CD pipeline\n- Docker support\n- Documentation`,
    packageJson: stack === 'react' || stack === 'node' || stack === 'vue'
      ? { name: repo, version: '1.0.0', dependencies: {} }
      : null,
    owner: {
      login: owner,
      avatarUrl: `https://github.com/${owner}.png`,
    },
  };
}

function generateArchitectureReview(repo: Repository): AgentReview {
  const score = randomBetween(55, 95);
  const findings: Finding[] = [
    {
      severity: 'info',
      title: 'Modular Architecture Detected',
      description: `The repository follows a modular architecture pattern with clear separation of concerns across ${Object.keys(repo.languages).length} languages/technologies.`,
      category: 'Structure',
    },
    {
      severity: score > 80 ? 'info' : 'medium',
      title: 'Dependency Management',
      description: repo.packageJson
        ? 'Package management is properly configured with dependency lockfile present.'
        : 'Build configuration detected with standard dependency management patterns.',
      category: 'Dependencies',
    },
    {
      severity: repo.hasTests ? 'info' : 'high',
      title: repo.hasTests ? 'Test Infrastructure Present' : 'Limited Test Coverage Detected',
      description: repo.hasTests
        ? 'Testing infrastructure is properly configured with test runners and assertion libraries.'
        : 'No comprehensive test infrastructure detected. Consider adding unit tests, integration tests, and E2E tests.',
      category: 'Testing',
    },
    {
      severity: score > 75 ? 'low' : 'medium',
      title: 'Code Organization Assessment',
      description: `Repository size of ${(repo.size / 1024).toFixed(1)}MB suggests ${repo.size > 100000 ? 'a large-scale' : 'a well-scoped'} project. Folder structure follows ${repo.language} community conventions.`,
      category: 'Organization',
    },
    {
      severity: 'medium',
      title: 'API Design Patterns',
      description: 'REST API patterns detected with standard HTTP method usage. Consider implementing API versioning and OpenAPI documentation for better maintainability.',
      category: 'API Design',
    },
    {
      severity: repo.hasCI ? 'info' : 'high',
      title: repo.hasCI ? 'CI/CD Pipeline Configured' : 'No CI/CD Pipeline Detected',
      description: repo.hasCI
        ? 'Continuous integration and deployment pipelines are configured with automated build and test steps.'
        : 'No CI/CD configuration found. Implement GitHub Actions or similar CI/CD to automate testing and deployment.',
      category: 'DevOps',
    },
  ];

  return {
    agentName: 'Architecture Agent',
    category: 'architecture',
    score,
    summary: `The ${repo.name} repository demonstrates ${score > 80 ? 'strong' : score > 65 ? 'adequate' : 'developing'} architectural patterns. The project uses ${repo.language} as its primary language with ${Object.keys(repo.languages).length} supporting technologies. ${repo.hasCI ? 'CI/CD pipelines are properly configured.' : 'CI/CD configuration is recommended.'} ${repo.hasTests ? 'Test infrastructure is in place.' : 'Testing infrastructure needs improvement.'}`,
    findings,
    recommendations: [
      'Implement comprehensive API documentation using OpenAPI/Swagger specifications',
      'Add architectural decision records (ADRs) to document key design choices',
      score > 75 ? 'Consider implementing event-driven architecture for better scalability' : 'Refactor to follow clean architecture principles with clear layer separation',
      'Implement feature flags for safer deployments and A/B testing',
      'Add dependency injection for better testability and loose coupling',
      'Create architecture diagrams using C4 model or similar notation',
    ],
  };
}

function generateSecurityReview(repo: Repository): AgentReview {
  const score = randomBetween(50, 92);
  const findings: Finding[] = [
    {
      severity: 'high',
      title: 'Dependency Vulnerability Scan Required',
      description: 'Regular automated dependency scanning should be configured. Tools like Dependabot, Snyk, or OWASP Dependency-Check should be integrated into the CI pipeline.',
      category: 'Dependencies',
    },
    {
      severity: score > 75 ? 'low' : 'critical',
      title: 'Secrets Management Assessment',
      description: score > 75
        ? 'Environment variables appear to be properly managed. Ensure .env files are in .gitignore.'
        : 'Potential hardcoded secrets or insufficient secrets management detected. Use vault services or environment-specific configuration.',
      category: 'Secrets',
    },
    {
      severity: 'medium',
      title: 'Input Validation Patterns',
      description: 'Input validation should be implemented at all entry points. Use schema validation libraries appropriate for the technology stack.',
      category: 'Input Validation',
    },
    {
      severity: 'medium',
      title: 'Authentication & Authorization',
      description: 'Ensure JWT tokens have appropriate expiration times, implement refresh token rotation, and use RBAC for fine-grained access control.',
      category: 'Auth',
    },
    {
      severity: score > 70 ? 'info' : 'high',
      title: 'HTTPS & Transport Security',
      description: 'Verify all API endpoints enforce HTTPS, implement HSTS headers, and configure proper CORS policies.',
      category: 'Transport',
    },
    {
      severity: 'low',
      title: 'Security Headers Configuration',
      description: 'Implement Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, and Referrer-Policy headers.',
      category: 'Headers',
    },
  ];

  return {
    agentName: 'Security Agent',
    category: 'security',
    score,
    summary: `Security analysis of ${repo.name} reveals a ${score > 80 ? 'well-secured' : score > 65 ? 'moderately secure' : 'security-concerning'} codebase. ${findings.filter(f => f.severity === 'critical').length} critical and ${findings.filter(f => f.severity === 'high').length} high-severity findings were identified. ${repo.license ? `Licensed under ${repo.license}.` : 'No license detected - consider adding one.'}`,
    findings,
    recommendations: [
      'Integrate automated security scanning (SAST/DAST) into CI/CD pipeline',
      'Implement rate limiting and request throttling on all API endpoints',
      'Set up Dependabot or Renovate for automated dependency updates',
      'Conduct regular penetration testing and security audits',
      'Implement comprehensive logging and monitoring for security events',
      'Use parameterized queries to prevent SQL injection attacks',
      'Add CSP headers and implement XSS prevention measures',
    ],
  };
}

function generateCloudReview(repo: Repository): AgentReview {
  const score = randomBetween(45, 93);
  const findings: Finding[] = [
    {
      severity: repo.hasDocker ? 'info' : 'high',
      title: repo.hasDocker ? 'Docker Configuration Present' : 'No Containerization Detected',
      description: repo.hasDocker
        ? 'Dockerfile is present with container configuration. Verify multi-stage builds and minimal base images are used.'
        : 'No Dockerfile found. Containerization is essential for cloud deployment consistency and portability.',
      category: 'Containerization',
    },
    {
      severity: 'medium',
      title: 'Horizontal Scaling Assessment',
      description: 'Evaluate stateless design patterns to enable horizontal scaling. Externalize session storage and use distributed caching.',
      category: 'Scalability',
    },
    {
      severity: repo.hasCI ? 'info' : 'medium',
      title: 'Infrastructure as Code',
      description: repo.hasCI
        ? 'CI/CD configuration detected. Consider adding Terraform/Pulumi for infrastructure provisioning.'
        : 'No IaC detected. Implement infrastructure as code for reproducible environments.',
      category: 'IaC',
    },
    {
      severity: 'low',
      title: 'Health Check Endpoints',
      description: 'Implement /health and /ready endpoints for container orchestration liveness and readiness probes.',
      category: 'Observability',
    },
    {
      severity: 'medium',
      title: 'Configuration Management',
      description: 'Use environment variables or external configuration services (AWS Parameter Store, HashiCorp Vault) for environment-specific settings.',
      category: 'Configuration',
    },
    {
      severity: score > 70 ? 'info' : 'high',
      title: 'Cloud Provider Compatibility',
      description: `The ${repo.language} stack is well-supported across major cloud providers (AWS, GCP, Azure). ${repo.hasDocker ? 'Container-based deployment is recommended.' : 'Consider containerizing for cloud deployment.'}`,
      category: 'Compatibility',
    },
  ];

  return {
    agentName: 'Cloud Readiness Agent',
    category: 'cloud',
    score,
    summary: `Cloud readiness assessment for ${repo.name} indicates ${score > 80 ? 'high' : score > 60 ? 'moderate' : 'low'} cloud deployment maturity. ${repo.hasDocker ? 'Containerization is configured.' : 'Containerization needs to be implemented.'} ${repo.hasCI ? 'CI/CD pipelines support automated deployments.' : 'Automated deployment pipelines are needed.'}`,
    findings,
    recommendations: [
      repo.hasDocker ? 'Optimize Dockerfile with multi-stage builds and minimal base images' : 'Create a Dockerfile with multi-stage builds for optimal container size',
      'Implement Kubernetes manifests or Helm charts for orchestration',
      'Set up auto-scaling policies based on CPU/memory metrics',
      'Configure centralized logging with ELK stack or CloudWatch',
      'Implement distributed tracing with OpenTelemetry',
      'Use managed database services for production deployments',
      'Set up blue-green or canary deployment strategies',
    ],
  };
}

function generatePerformanceReview(repo: Repository): AgentReview {
  const score = randomBetween(50, 94);
  const findings: Finding[] = [
    {
      severity: score > 75 ? 'info' : 'medium',
      title: 'Caching Strategy Assessment',
      description: 'Implement multi-layer caching: browser caching, CDN caching, application-level caching (Redis), and database query caching for optimal performance.',
      category: 'Caching',
    },
    {
      severity: 'medium',
      title: 'Database Query Optimization',
      description: 'Review database queries for N+1 problems, missing indexes, and inefficient joins. Use query profiling and explain plans.',
      category: 'Database',
    },
    {
      severity: 'low',
      title: 'Bundle Size Analysis',
      description: `Repository size is ${(repo.size / 1024).toFixed(1)}MB. ${repo.size > 100000 ? 'Consider code splitting and lazy loading to reduce initial bundle size.' : 'Bundle size appears manageable.'}`,
      category: 'Bundle',
    },
    {
      severity: score > 70 ? 'info' : 'high',
      title: 'API Response Time Optimization',
      description: 'Implement pagination, response compression (gzip/brotli), and consider GraphQL or field filtering to reduce payload sizes.',
      category: 'API',
    },
    {
      severity: 'medium',
      title: 'Memory Management',
      description: 'Monitor memory usage patterns, implement proper garbage collection strategies, and avoid memory leaks in long-running processes.',
      category: 'Memory',
    },
    {
      severity: 'low',
      title: 'Concurrent Request Handling',
      description: 'Implement connection pooling, async/await patterns, and proper thread management for handling concurrent requests efficiently.',
      category: 'Concurrency',
    },
  ];

  return {
    agentName: 'Performance Agent',
    category: 'performance',
    score,
    summary: `Performance analysis of ${repo.name} shows ${score > 80 ? 'excellent' : score > 65 ? 'good' : 'needs improvement in'} optimization patterns. The ${repo.language} codebase ${score > 75 ? 'follows' : 'should adopt'} modern performance best practices including caching strategies and efficient data handling.`,
    findings,
    recommendations: [
      'Implement Redis or Memcached for application-level caching',
      'Add database indexing strategy and query optimization',
      'Set up performance monitoring with APM tools (DataDog, New Relic)',
      'Implement lazy loading and code splitting for frontend assets',
      'Use CDN for static asset delivery',
      'Configure HTTP/2 and response compression',
      'Implement database connection pooling',
    ],
  };
}

function generateInterviewQuestions(repo: Repository): InterviewQuestion[] {
  const lang = repo.language;
  const questions: InterviewQuestion[] = [
    {
      id: 1,
      question: `Explain the architecture decisions made in the ${repo.name} project. Why was ${lang} chosen as the primary language?`,
      category: 'Architecture',
      difficulty: 'medium',
      expectedAnswer: `The candidate should discuss ${lang}'s strengths for this type of project, including ecosystem maturity, performance characteristics, and team expertise. They should reference specific architectural patterns visible in the codebase.`,
      followUp: `How would you evolve this architecture to handle 10x the current traffic?`,
    },
    {
      id: 2,
      question: `What testing strategy would you implement for this ${lang} project, and how would you measure code coverage?`,
      category: 'Testing',
      difficulty: 'medium',
      expectedAnswer: `Should discuss unit testing, integration testing, and E2E testing. Mention specific frameworks for ${lang}, coverage tools, and CI integration. Target coverage should be 80%+ with focus on critical paths.`,
      followUp: 'How do you decide what to test and what not to test?',
    },
    {
      id: 3,
      question: `How would you handle a critical security vulnerability discovered in one of the ${repo.name} dependencies?`,
      category: 'Security',
      difficulty: 'hard',
      expectedAnswer: 'Should outline incident response: assess impact, create hotfix branch, update dependency, run security scan, deploy fix, communicate with stakeholders, and conduct post-mortem.',
      followUp: 'How would you prevent this from happening again?',
    },
    {
      id: 4,
      question: `Describe how you would deploy ${repo.name} to a production Kubernetes cluster with zero downtime.`,
      category: 'DevOps',
      difficulty: 'hard',
      expectedAnswer: 'Should discuss rolling deployments, health checks, readiness probes, blue-green or canary strategies, rollback procedures, and monitoring during deployment.',
      followUp: 'What metrics would you monitor during and after deployment?',
    },
    {
      id: 5,
      question: `What database optimization strategies would you apply to improve the performance of ${repo.name}?`,
      category: 'Performance',
      difficulty: 'medium',
      expectedAnswer: 'Should mention indexing strategies, query optimization, connection pooling, read replicas, caching layers, and monitoring slow queries.',
      followUp: 'How would you handle data migration for schema changes in production?',
    },
    {
      id: 6,
      question: `How would you implement observability (logging, metrics, tracing) in the ${repo.name} project?`,
      category: 'Observability',
      difficulty: 'medium',
      expectedAnswer: 'Should discuss structured logging, metric collection (Prometheus), distributed tracing (OpenTelemetry), alerting, dashboards, and log aggregation.',
      followUp: 'How would you troubleshoot a latency spike in production?',
    },
    {
      id: 7,
      question: `Explain the CI/CD pipeline you would design for ${repo.name}. What stages would you include?`,
      category: 'DevOps',
      difficulty: 'easy',
      expectedAnswer: 'Should outline: lint, test, build, security scan, deploy to staging, integration tests, deploy to production, smoke tests, and monitoring.',
      followUp: 'How would you handle environment-specific configurations?',
    },
    {
      id: 8,
      question: `How would you scale ${repo.name} to handle millions of requests per day? What architectural changes would be needed?`,
      category: 'Architecture',
      difficulty: 'hard',
      expectedAnswer: 'Should discuss horizontal scaling, load balancing, caching (Redis/CDN), database sharding/replication, message queues, microservices decomposition, and auto-scaling.',
      followUp: 'What would be the first bottleneck you\'d address?',
    },
    {
      id: 9,
      question: `What code review practices would you establish for the ${repo.name} team?`,
      category: 'Best Practices',
      difficulty: 'easy',
      expectedAnswer: 'Should mention PR size limits, review checklist, automated checks (linting, testing), security review, documentation requirements, and constructive feedback culture.',
      followUp: 'How would you handle disagreements during code review?',
    },
    {
      id: 10,
      question: `Design an error handling and resilience strategy for ${repo.name}. How would you handle downstream service failures?`,
      category: 'Resilience',
      difficulty: 'hard',
      expectedAnswer: 'Should discuss circuit breaker pattern, retry with exponential backoff, fallback responses, graceful degradation, bulkhead isolation, and timeout configuration.',
      followUp: 'How would you test the resilience of the system?',
    },
  ];

  return questions;
}

function generateResumeBullets(repo: Repository, scores: Scores): ResumeBullet[] {
  const lang = repo.language;
  return [
    {
      id: 1,
      bullet: `Architected and developed ${repo.name}, a ${lang}-based application serving ${(repo.stars * 10).toLocaleString()}+ users with ${scores.architecture}% architecture quality score`,
      category: 'Architecture',
      impact: 'Led technical architecture decisions resulting in highly maintainable and scalable codebase',
    },
    {
      id: 2,
      bullet: `Implemented comprehensive security measures achieving ${scores.security}% security compliance score, including automated vulnerability scanning and secrets management`,
      category: 'Security',
      impact: 'Zero critical security incidents in production deployment',
    },
    {
      id: 3,
      bullet: `Designed cloud-native architecture with ${scores.cloudReadiness}% cloud readiness score, enabling seamless deployment across AWS/GCP/Azure environments`,
      category: 'Cloud',
      impact: 'Reduced deployment time by 70% through containerization and CI/CD automation',
    },
    {
      id: 4,
      bullet: `Optimized application performance achieving ${scores.performance}% performance score through caching strategies, query optimization, and code splitting`,
      category: 'Performance',
      impact: 'Improved API response times by 60% and reduced infrastructure costs by 40%',
    },
    {
      id: 5,
      bullet: `Managed open-source project with ${repo.stars.toLocaleString()} GitHub stars and ${repo.forks.toLocaleString()} forks, fostering an active contributor community`,
      category: 'Leadership',
      impact: `Built community of ${repo.forks.toLocaleString()}+ contributors across ${repo.topics.length} technology domains`,
    },
    {
      id: 6,
      bullet: `Built multi-language codebase spanning ${Object.keys(repo.languages).join(', ')} with ${scores.maintainability}% maintainability score and comprehensive documentation`,
      category: 'Engineering',
      impact: 'Reduced onboarding time for new developers by 50% through clear architecture and documentation',
    },
    {
      id: 7,
      bullet: `Established CI/CD pipeline with automated testing, security scanning, and deployment achieving ${repo.hasCI ? '99.9%' : '95%'} deployment success rate`,
      category: 'DevOps',
      impact: 'Enabled team to ship features 3x faster with confidence through automated quality gates',
    },
    {
      id: 8,
      bullet: `Delivered production-grade ${lang} application with overall engineering score of ${scores.overall}%, demonstrating excellence in architecture, security, and performance`,
      category: 'Overall',
      impact: `Project recognized across ${repo.watchers.toLocaleString()} watchers for engineering quality and best practices`,
    },
  ];
}

export async function analyzeRepository(
  repoUrl: string,
  onProgress: (
    step: string,
    progress: number
  ) => void
): Promise<any> {

  try {

    onProgress(
      "Connecting to FastAPI Backend...",
      20
    );

    const response = await axios.post(
      "http://127.0.0.1:8000/api/analyze",
      {
        repo_url: repoUrl
      }
    );

    onProgress(
      "AI Agents Running...",
      80
    );

    const backendData = response.data;

    onProgress(
      "Analysis Complete",
      100
    );

    return {
      id: `analysis-${Date.now()}`,

      repository: backendData.repository,

      scores: backendData.scores,

      reviews: {
        architecture: {
          score: backendData.scores.architecture,
          summary: backendData.reviews.architecture,
          findings: [],
          recommendations: []
        },

        security: {
          score: backendData.scores.security,
          summary: backendData.reviews.security,
          findings: [],
          recommendations: []
        },

        cloud: {
          score: backendData.scores.cloudReadiness,
          summary: backendData.reviews.cloud,
          findings: [],
          recommendations: []
        },

        performance: {
          score: backendData.scores.performance,
          summary: backendData.reviews.performance,
          findings: [],
          recommendations: []
        }
      },

      interviewQuestions: [
        {
          id: 1,
          question: backendData.interviewQuestions,
          category: "AI Generated",
          difficulty: "Medium"
        }
      ],

      resumeBullets: [
        {
          id: 1,
          bullet: backendData.resumeBullets,
          category: "AI Generated",
          impact: "Generated from repository analysis"
        }
      ],

      createdAt: new Date().toISOString(),

      status: "completed",

      processingStep: "Complete"
    };

  } catch (error) {

    console.error(error);

    throw new Error(
      "Failed to connect to backend"
    );
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
