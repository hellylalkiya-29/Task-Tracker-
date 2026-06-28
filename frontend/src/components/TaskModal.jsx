import React, { useState, useEffect, useRef } from 'react';
import { useTask } from '../context/TaskContext';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
  tags: '',
};

function validate(form) {
  const errs = {};
  if (!form.title.trim()) errs.title = 'Title is required';
  else if (form.title.trim().length < 3) errs.title = 'Title must be at least 3 characters';
  else if (form.title.trim().length > 100) errs.title = 'Title cannot exceed 100 characters';
  if (form.description.length > 500) errs.description = 'Description cannot exceed 500 characters';
  return errs;
}

export default function TaskModal({ task, onClose }) {
  const { createTask, updateTask } = useTask();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const firstRef = useRef(null);
  const isEdit = Boolean(task);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
        tags: (task.tags || []).join(', '),
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
    firstRef.current?.focus();
  }, [task]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((errs) => ({ ...errs, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || null,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    setSubmitting(true);
    try {
      if (isEdit) {
        await updateTask(task._id, payload);
        toast.success('Task updated!');
      } else {
        await createTask(payload);
        toast.success('Task created!');
      }
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Task' : 'New Task'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <div className="field">
            <label htmlFor="title">Title <span className="required">*</span></label>
            <input
              ref={firstRef}
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              className={errors.title ? 'input error' : 'input'}
              placeholder="What needs to be done?"
              maxLength={100}
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className={errors.description ? 'input textarea error' : 'input textarea'}
              placeholder="Add details…"
              rows={3}
              maxLength={500}
            />
            <span className="char-count">{form.description.length}/500</span>
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange} className="input">
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="priority">Priority</label>
              <select id="priority" name="priority" value={form.priority} onChange={handleChange} className="input">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="dueDate">Due Date</label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="field">
            <label htmlFor="tags">Tags</label>
            <input
              id="tags"
              name="tags"
              type="text"
              value={form.tags}
              onChange={handleChange}
              className="input"
              placeholder="design, backend, urgent (comma-separated)"
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}