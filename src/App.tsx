import { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import type { Analysis } from './types';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import AnalyzePage from './pages/AnalyzePage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';

export default function App() {
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);

  return (
    <Router>
      <div className="min-h-screen bg-dark-900 text-white">
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/analyze"
            element={
              <AnalyzePage onAnalysisComplete={(analysis) => setCurrentAnalysis(analysis)} />
            }
          />
          <Route
            path="/dashboard/:id"
            element={<DashboardPage currentAnalysis={currentAnalysis} />}
          />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </div>
    </Router>
  );
}
