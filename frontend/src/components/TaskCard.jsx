import React, { useState } from 'react';
import { format, isPast, isToday } from 'date-fns';
import { useTask } from '../context/TaskContext';
import toast from 'react-hot-toast';

const PRIORITY_META = {
  high: { label: 'High', class: 'priority-high' },
  medium: { label: 'Medium', class: 'priority-medium' },
  low: { label: 'Low', class: 'priority-low' },
};

const STATUS_CYCLE = { todo: 'in-progress', 'in-progress': 'done', done: 'todo' };
const STATUS_ICON = { todo: '○', 'in-progress': '◑', done: '●' };
const STATUS_LABEL = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };

export default function TaskCard({ task, onEdit }) {
  const { patchTask, deleteTask } = useTask();
  const [deleting, setDeleting] = useState(false);
  const [cycling, setCycling] = useState(false);

  const handleStatusCycle = async () => {
    if (cycling) return;
    setCycling(true);
    try {
      const next = STATUS_CYCLE[task.status];
      await patchTask(task._id, { status: next });
      toast.success(`Moved to ${STATUS_LABEL[next]}`);
    } catch (err) {
      toast.error(err.message);
    }
    setCycling(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    setDeleting(true);
    try {
      await deleteTask(task._id);
      toast.success('Task deleted');
    } catch (err) {
      toast.error(err.message);
      setDeleting(false);
    }
  };

  const dueDateEl = () => {
    if (!task.dueDate) return null;
    const d = new Date(task.dueDate);
    const overdue = isPast(d) && task.status !== 'done';
    const dueToday = isToday(d);
    return (
      <span className={`due-date ${overdue ? 'overdue' : dueToday ? 'due-today' : ''}`}>
        {overdue ? '⚠ ' : ''}
        {format(d, 'MMM d, yyyy')}
      </span>
    );
  };

  const pMeta = PRIORITY_META[task.priority];

  return (
    <div className={`task-card status-${task.status} ${deleting ? 'deleting' : ''}`}>
      <div className="task-card-header">
        <button
          className={`status-btn status-${task.status} ${cycling ? 'spinning' : ''}`}
          onClick={handleStatusCycle}
          title={`Current: ${STATUS_LABEL[task.status]} — click to advance`}
          aria-label="Toggle status"
        >
          {STATUS_ICON[task.status]}
        </button>

        <div className="task-title-wrap">
          <h3 className={`task-title ${task.status === 'done' ? 'done-text' : ''}`}>
            {task.title}
          </h3>
          <div className="task-meta">
            <span className={`badge ${pMeta.class}`}>{pMeta.label}</span>
            <span className="badge badge-status">{STATUS_LABEL[task.status]}</span>
            {dueDateEl()}
          </div>
        </div>

        <div className="task-actions">
          <button className="icon-btn edit-btn" onClick={() => onEdit(task)} title="Edit">✎</button>
          <button className="icon-btn delete-btn" onClick={handleDelete} title="Delete">✕</button>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {task.tags?.length > 0 && (
        <div className="tags-row">
          {task.tags.map((tag) => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      )}

      <div className="task-footer">
        <span className="task-date">
          Created {format(new Date(task.createdAt), 'MMM d')}
        </span>
      </div>
    </div>
  );
}
