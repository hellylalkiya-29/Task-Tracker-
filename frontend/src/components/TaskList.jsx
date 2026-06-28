import React from 'react';
import { useTask } from '../context/TaskContext';
import TaskCard from './TaskCard';

export default function TaskList({ onEdit }) {
  const { tasks, loading } = useTask();

  if (loading) {
    return (
      <div className="task-list-empty">
        <div className="spinner" />
        <p>Loading tasks…</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <div className="empty-icon">◈</div>
        <h3>No tasks yet</h3>
        <p>Create your first task to get started.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} onEdit={onEdit} />
      ))}
    </div>
  );
}