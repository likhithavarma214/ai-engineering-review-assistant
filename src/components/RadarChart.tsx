import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import type { Scores } from '../types';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface RadarChartProps {
  scores: Scores;
}

export default function RadarChartComponent({ scores }: RadarChartProps) {
  const data = {
    labels: ['Architecture', 'Security', 'Cloud Readiness', 'Maintainability', 'Performance'],
    datasets: [
      {
        label: 'Engineering Scores',
        data: [
          scores.architecture,
          scores.security,
          scores.cloudReadiness,
          scores.maintainability,
          scores.performance,
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        borderColor: 'rgba(99, 102, 241, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#818cf8',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#818cf8',
        fill: true,
      },
      {
        label: 'Industry Benchmark',
        data: [75, 70, 65, 70, 72],
        backgroundColor: 'rgba(6, 182, 212, 0.08)',
        borderColor: 'rgba(6, 182, 212, 0.4)',
        borderWidth: 1.5,
        borderDash: [5, 5],
        pointBackgroundColor: 'rgba(6, 182, 212, 0.6)',
        pointBorderColor: 'rgba(6, 182, 212, 0.8)',
        pointBorderWidth: 1,
        pointRadius: 3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: 0,
        max: 100,
        beginAtZero: true,
        ticks: {
          stepSize: 20,
          color: 'rgba(138, 138, 170, 0.6)',
          backdropColor: 'transparent',
          font: { size: 10 },
        },
        pointLabels: {
          color: '#b8b8d0',
          font: { size: 11, weight: 'bold' as const },
          padding: 15,
        },
        grid: {
          color: 'rgba(99, 102, 241, 0.08)',
          circular: true,
        },
        angleLines: {
          color: 'rgba(99, 102, 241, 0.08)',
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#b8b8d0',
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 11 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(26, 26, 46, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#b8b8d0',
        borderColor: 'rgba(99, 102, 241, 0.3)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${context.raw}%`;
          },
        },
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeOutQuart' as const,
    },
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-xl">📊</span> Engineering Score Radar
      </h3>
      <div className="max-w-md mx-auto">
        <Radar data={data} options={options} />
      </div>
    </div>
  );
}
