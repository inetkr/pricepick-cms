import React from 'react';

interface ChartData {
  label: string;
  value: number;
  isToday?: boolean;
}

interface ChartBarProps {
  data: ChartData[];
  maxHeight?: number;
}

export const ChartBar: React.FC<ChartBarProps> = ({ data, maxHeight = 100 }) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="chart-bar-wrap">
      {data.map((item, idx) => {
        const height = (item.value / maxValue) * maxHeight;
        return (
          <div key={idx} className="chart-bar-col">
            <div className="chart-value">+{item.value}</div>
            <div
              className={`chart-bar ${item.isToday ? 'today' : ''}`}
              style={{ height: `${height}%` }}
            />
            <div className="chart-label">{item.label}</div>
          </div>
        );
      })}
    </div>
  );
};
