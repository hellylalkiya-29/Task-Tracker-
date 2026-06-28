import React from 'react';
import { useTask } from '../context/TaskContext';

const statConfig = [
  { key: 'total', label: 'Total Tasks', color: 'var(--accent)', icon: '◈' },
  { key: 'todo', label: 'To Do', color: '#64748b', icon: '○' },
  { key: 'in-progress', label: 'In Progress', color: '#f59e0b', icon: '◑' },
  { key: 'done', label: 'Done', color: '#22c55e', icon: '●' },
];

export default function StatsBar() {
  const { stats } = useTask();

  return (
    <div className="stats-bar">
      {statConfig.map(({ key, label, color, icon }) => (
        <div key={key} className="stat-card" style={{ '--stat-color': color }}>
          <span className="stat-icon">{icon}</span>
          <div className="stat-info">
            <span className="stat-number">{stats[key] ?? 0}</span>
            <span className="stat-label">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}