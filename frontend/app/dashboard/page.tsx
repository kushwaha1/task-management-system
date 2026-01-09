/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { taskAPI } from '@/lib/api';
import { Task } from '@/interceptors/types';
import toast from 'react-hot-toast';
import TaskList from '@/components/TaskList';
import TaskModal from '@/components/TaskModal';

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, page, statusFilter, searchQuery]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getTasks({
        page,
        limit: 10,
        ...(statusFilter && { status: statusFilter }),
        ...(searchQuery && { search: searchQuery }),
      });
      setTasks(response.tasks);
      setTotalPages(response.pagination.totalPages);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch tasks. Please try again.';
      toast.error(message, { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    toast(
        (t) => (
        <div className="flex flex-col gap-3">
            <p className="text-sm text-white">
            Are you sure you want to delete this task?
            </p>

            <div className="flex justify-end gap-2">
            <button
                onClick={() => toast.dismiss(t.id)}
                className="px-3 py-1 text-sm rounded-md border border-gray-300 text-white hover:bg-gray-100 hover:text-gray-900"
            >
                Cancel
            </button>

            <button
                onClick={async () => {
                toast.dismiss(t.id);
                try {
                    await taskAPI.deleteTask(id);
                    toast.success('Task deleted successfully!');
                    fetchTasks();
                } catch (error: any) {
                    const message =
                    error.response?.data?.error ||
                    'Failed to delete task. Please try again.';
                    toast.error(message, { duration: 4000 });
                }
                }}
                className="px-3 py-1 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
            >
                Delete
            </button>
            </div>
        </div>
        ),
        {
        duration: Infinity,
        position: 'top-center',
        }
    );
};


  const handleToggleTask = async (id: string) => {
    try {
      await taskAPI.toggleTask(id);
      toast.success('Task status updated successfully!');
      fetchTasks();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to update task status. Please try again.';
      toast.error(message, { duration: 4000 });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    fetchTasks();
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <button
            onClick={handleCreateTask}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold whitespace-nowrap"
          >
            + New Task
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Loading tasks...</div>
          </div>
        ) : (
          <>
            <TaskList
              tasks={tasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onToggle={handleToggleTask}
            />

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-gray-900"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-900">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-gray-900"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}