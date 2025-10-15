
import React from 'react';

interface PieChartProps {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  if (total === 0) {
    return (
        <div className="flex items-center justify-center h-48 text-slate-500 dark:text-slate-400">
            Nenhuma tarefa para exibir.
        </div>
    );
  }

  let cumulativePercent = 0;

  const segments = data.map(item => {
    const percent = (item.value / total) * 100;
    const dashArray = 2 * Math.PI * 45;
    const dashOffset = dashArray * (1 - percent / 100);
    const rotation = cumulativePercent * 3.6; // 1% = 3.6 degrees
    cumulativePercent += percent;

    return { ...item, percent, dashArray, dashOffset, rotation };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative w-48 h-48 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          {segments.map((segment, index) => (
            <circle
              key={index}
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke={segment.color}
              strokeWidth="10"
              strokeDasharray={segment.dashArray}
              strokeDashoffset={segment.dashOffset}
              transform={`rotate(${segment.rotation} 50 50)`}
            />
          ))}
        </svg>
      </div>
      <ul className="space-y-2 w-full">
        {segments.map((segment, index) => (
          <li key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: segment.color }}
              ></span>
              <span className="text-slate-700 dark:text-slate-300">{segment.label}</span>
            </div>
            <span className="font-semibold text-slate-500 dark:text-slate-400">
                {segment.percent.toFixed(0)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PieChart;
