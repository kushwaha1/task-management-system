import { Task } from '../interceptors/types';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
};

const statusLabels = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

export default function TaskList({ tasks, onEdit, onDelete, onToggle }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-xl text-gray-600">No tasks found</p>
        <p className="text-gray-500 mt-2">Create a new task to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold text-gray-900">{task.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[task.status]}`}>
                  {statusLabels[task.status]}
                </span>
              </div>
              {task.description && (
                <p className="text-gray-600 mb-3">{task.description}</p>
              )}
              <p className="text-sm text-gray-500">
                Created: {new Date(task.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onToggle(task.id)}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                title="Toggle status"
              >
                ✓
              </button>
              <button
                onClick={() => onEdit(task)}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}