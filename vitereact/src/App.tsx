import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card } from './components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './components/ui/select';
import { Label } from './components/ui/label';
import { Alert, AlertDescription } from './components/ui/alert';

interface Task {
  id: number;
  title: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

type SortOption = 'created' | 'priority' | 'alphabetical';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('created');
  const [error, setError] = useState<string>('');

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addTask = () => {
    if (newTask.trim().length < 3) {
      setError('Task title must be at least 3 characters long');
      return;
    }
    setError('');
    setTasks([...tasks, {
      id: Date.now(),
      title: newTask,
      status: 'pending',
      priority: newTaskPriority,
      createdAt: new Date()
    }]);
    setNewTask('');
  };

  const sortTasks = (tasksToSort: Task[]) => {
    return [...tasksToSort].sort((a, b) => {
      switch (sortBy) {
        case 'created':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  const filteredTasks = sortTasks(
    tasks.filter(task => {
      if (filter === 'all') return true;
      return task.status === filter;
    })
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" role="application">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10" role="banner">
        <nav className="container mx-auto px-4 py-4" aria-label="Main navigation">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
            </div>
            <div className="flex gap-4" role="navigation">
              <Button variant="ghost" className="hover:bg-gray-100 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Dashboard
              </Button>
              <Button variant="ghost" className="hover:bg-gray-100 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Settings
              </Button>
            </div>
          </div>
          <div className="mt-4 border-t pt-4">
            <p className="text-sm text-gray-600">Welcome to your personal task management dashboard. Stay organized and boost your productivity.</p>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8" role="main">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Task Management Center</h2>
          <p className="text-gray-600">Create, organize, and track your tasks efficiently.</p>
        </div>
        {/* Task Creation Form */}
        <Card className="p-6 mb-8">
          <form onSubmit={(e) => { e.preventDefault(); addTask(); }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-task">New Task</Label>
              <div className="flex gap-4">
                <Input
                  id="new-task"
                  type="text"
                  placeholder="Add a new task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="flex-grow"
                  aria-label="New task input"
                  required
                  minLength={3}
                />
                <Select value={newTaskPriority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewTaskPriority(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit">Add Task</Button>
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>
        </Card>

        {/* Task Controls */}
        <div className="flex justify-between items-center mb-6 gap-4">
          <div className="flex gap-4">
            <div>
              <Label htmlFor="filter">Filter</Label>
              <Select value={filter} onValueChange={(value: 'all' | 'pending' | 'completed') => setFilter(value)}>
                <SelectTrigger id="filter" className="w-32">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sort">Sort By</Label>
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger id="sort" className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Creation Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {filteredTasks.length} task(s) • {tasks.filter(t => t.status === 'completed').length} completed
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">
              No tasks found. Create a new task to get started!
            </Card>
          ) : (
            filteredTasks.map(task => (
              <Card key={task.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-grow">
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      onChange={() => toggleTask(task.id)}
                      className="w-5 h-5"
                      aria-label={`Mark ${task.title} as ${task.status === 'completed' ? 'pending' : 'completed'}`}
                    />
                    <div className="flex flex-col">
                      <span className={`text-lg ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </span>
                      <span className="text-sm text-gray-500">
                        Created {new Date(task.createdAt).toLocaleDateString()} • 
                        Priority: <span className={`font-medium ${
                          task.priority === 'high' ? 'text-red-500' :
                          task.priority === 'medium' ? 'text-yellow-500' :
                          'text-green-500'
                        }`}>{task.priority}</span>
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`Delete ${task.title}`}
                    className="ml-4"
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-sm mt-auto" role="contentinfo">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Task Manager</h3>
              <p className="text-sm text-gray-600">Organize your tasks efficiently and boost your productivity with our intuitive task management solution.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Quick Links</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><a href="#" className="hover:text-blue-600">Dashboard</a></li>
                <li><a href="#" className="hover:text-blue-600">Settings</a></li>
                <li><a href="#" className="hover:text-blue-600">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Contact</h3>
              <p className="text-sm text-gray-600">Need help? Contact our support team.</p>
              <Button variant="link" className="text-blue-600 hover:text-blue-800 p-0 h-auto text-sm">
                Contact Support
              </Button>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} Task Manager. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;