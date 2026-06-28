import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { taskAPI } from '../utils/api';
import toast from 'react-hot-toast';

const TaskContext = createContext();

const initialState = {
  tasks: [],
  stats: { todo: 0, 'in-progress': 0, done: 0, total: 0 },
  loading: false,
  statsLoading: false,
  filters: { status: '', priority: '', search: '', sort: '-createdAt' },
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING': return { ...state, loading: action.payload };
    case 'SET_STATS_LOADING': return { ...state, statsLoading: action.payload };
    case 'SET_TASKS': return { ...state, tasks: action.payload, loading: false };
    case 'SET_STATS': return { ...state, stats: action.payload };
    case 'ADD_TASK': return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t._id === action.payload._id ? action.payload : t)),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t._id !== action.payload) };
    case 'SET_FILTERS': return { ...state, filters: { ...state.filters, ...action.payload } };
    default: return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchTasks = useCallback(async (filters = state.filters) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;
      if (filters.sort) params.sort = filters.sort;

      const res = await taskAPI.getAll(params);
      dispatch({ type: 'SET_TASKS', payload: res.data.data });
    } catch (err) {
      toast.error(err.message);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.filters]);

  const fetchStats = useCallback(async () => {
    dispatch({ type: 'SET_STATS_LOADING', payload: true });
    try {
      const res = await taskAPI.getStats();
      dispatch({ type: 'SET_STATS', payload: res.data.data });
    } catch (_) {}
    dispatch({ type: 'SET_STATS_LOADING', payload: false });
  }, []);

  const createTask = useCallback(async (data) => {
    const res = await taskAPI.create(data);
    dispatch({ type: 'ADD_TASK', payload: res.data.data });
    fetchStats();
    return res.data.data;
  }, [fetchStats]);

  const updateTask = useCallback(async (id, data) => {
    const res = await taskAPI.update(id, data);
    dispatch({ type: 'UPDATE_TASK', payload: res.data.data });
    fetchStats();
    return res.data.data;
  }, [fetchStats]);

  const patchTask = useCallback(async (id, data) => {
    const res = await taskAPI.patch(id, data);
    dispatch({ type: 'UPDATE_TASK', payload: res.data.data });
    fetchStats();
    return res.data.data;
  }, [fetchStats]);

  const deleteTask = useCallback(async (id) => {
    await taskAPI.delete(id);
    dispatch({ type: 'DELETE_TASK', payload: id });
    fetchStats();
  }, [fetchStats]);

  const setFilters = useCallback((newFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  }, []);

  return (
    <TaskContext.Provider value={{
      ...state,
      fetchTasks,
      fetchStats,
      createTask,
      updateTask,
      patchTask,
      deleteTask,
      setFilters,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTask = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTask must be used within TaskProvider');
  return ctx;
};