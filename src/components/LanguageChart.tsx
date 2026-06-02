import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface LanguageChartProps {
  languages?: Record<string, number>;
}

const COLORS = [
  "#6366f1",
  "#06b6d4",
  "#a855f7",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#f97316",
  "#22d3ee",
];

export default function LanguageChart({
  languages,
}: LanguageChartProps) {

  const safeLanguages =
    languages && Object.keys(languages).length > 0
      ? languages
      : {
          JavaScript: 100,
        };

  const labels =
    Object.keys(safeLanguages);

  const values =
    Object.values(safeLanguages);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: COLORS.slice(
          0,
          labels.length
        ),
        borderColor:
          "rgba(26,26,46,0.8)",
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: "65%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#b8b8d0",
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (
            context: any
          ) {
            return ` ${context.label}: ${context.raw}%`;
          },
        },
      },
    },
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span>💻</span>
        Language Distribution
      </h3>

      <div className="max-w-[200px] mx-auto">
        <Doughnut
          data={data}
          options={options}
        />
      </div>
    </div>
  );
}