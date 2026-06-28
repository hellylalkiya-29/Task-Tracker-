/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import { useDebounce } from '../hooks/useDebounce';

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: '-dueDate', label: 'Due Date ↓' },
  { value: 'dueDate', label: 'Due Date ↑' },
  { value: 'title', label: 'Title A-Z' },
  { value: '-title', label: 'Title Z-A' },
  { value: '-priority', label: 'Priority High-Low' },
];

export default function FilterBar() {
  const { filters, setFilters, fetchTasks } = useTask();
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(localSearch, 400);

  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch, setFilters]);

  useEffect(() => {
    fetchTasks({ ...filters, search: debouncedSearch });
  }, [filters.status, filters.priority, filters.sort, debouncedSearch]);

  const handleChange = (key, value) => {
    setFilters({ [key]: value });
  };

  const clearFilters = () => {
    setLocalSearch('');
    setFilters({ status: '', priority: '', search: '', sort: '-createdAt' });
  };

  const hasActiveFilters = filters.status || filters.priority || filters.search;

  return (
    <div className="filter-bar">
      <div className="search-wrap">
        <span className="search-icon">⌕</span>
        <input
          type="text"
          placeholder="Search tasks…"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="search-input"
        />
        {localSearch && (
          <button className="clear-search" onClick={() => setLocalSearch('')}>✕</button>
        )}
      </div>

      <div className="filter-controls">
        <select
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
          className="filter-select"
        >
          <option value="">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={filters.sort}
          onChange={(e) => handleChange('sort', e.target.value)}
          className="filter-select"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button className="btn btn-ghost" onClick={clearFilters}>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}