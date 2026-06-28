import React from 'react';
import { Toaster } from 'react-hot-toast';
import { TaskProvider } from './context/TaskContext';
import Home from './pages/Home';
import './App.css';

export default function App() {
  return (
    <TaskProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            fontSize: '0.875rem',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Home />
    </TaskProvider>
  );
}