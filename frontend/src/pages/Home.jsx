/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import StatsBar from '../components/StatsBar';
import FilterBar from '../components/FilterBar';
import TaskList from '../components/TaskList';
import TaskModal from '../components/TaskModal';

export default function Home() {
  const { fetchTasks, fetchStats, filters } = useTask();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks(filters);
    fetchStats();
  }, []);

  const openCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="page">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo-wrap">
            <span className="logo-mark">◈</span>
            <span className="logo-text">TaskFlow</span>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            + New Task
          </button>
        </div>
      </header>

      <main className="main-content">
        <StatsBar />
        <FilterBar />
        <TaskList onEdit={openEdit} />
      </main>

      {modalOpen && (
        <TaskModal task={editingTask} onClose={closeModal} />
      )}
    </div>
  );
}