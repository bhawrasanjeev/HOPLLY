import React, { useState } from 'react';
import { Task, UserProfile } from '../types';
import { TaskCard } from '../components/TaskCard';
import { Plus } from 'lucide-react';
import './TasksPage.css';

interface TasksPageProps {
  tasks: Task[];
  currentUser: UserProfile | null;
  onSelectTask: (task: Task) => void;
  onAcceptTask: (taskId: string, e: React.MouseEvent) => void;
  onCompleteTask?: (taskId: string, e: React.MouseEvent) => void;
  onCallPoster?: (phone: string, posterName: string, e: React.MouseEvent) => void;
  onChatPoster?: (posterName: string, e: React.MouseEvent) => void;
  onNavigate: (tab: string) => void;
}

export const TasksPage: React.FC<TasksPageProps> = ({
  tasks,
  currentUser,
  onSelectTask,
  onAcceptTask,
  onCompleteTask,
  onCallPoster,
  onChatPoster,
  onNavigate,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'posted' | 'accepted'>('posted');

  const currentFirstName = currentUser?.name?.split(' ')[0]?.toLowerCase() || '';

  const postedTasks = tasks.filter(
    (t) =>
      (currentFirstName && t.posterName.toLowerCase().includes(currentFirstName)) ||
      t.id === 'task-1' ||
      t.id === 'task-6'
  );

  const acceptedTasks = tasks.filter(
    (t) =>
      t.status === 'accepted' ||
      (currentFirstName && t.acceptedBy?.toLowerCase().includes(currentFirstName))
  );

  const displayedTasks = activeSubTab === 'posted' ? postedTasks : acceptedTasks;

  return (
    <main className="page-container">
      {/* Header & Subtab Switcher */}
      <div className="flex-between flex-wrap gap-4" style={{ alignItems: 'flex-end' }}>
        <div>
          <h1 className="h1-title">My Tasks</h1>
          <p className="text-sm text-muted" style={{ marginTop: '4px' }}>
            Manage your posted requests and active accepted jobs.
          </p>
        </div>

        {/* Pill Selector */}
        <div style={{ display: 'inline-flex', padding: '4px', backgroundColor: 'var(--bg-muted)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveSubTab('posted')}
            className="btn btn-sm"
            style={{
              borderRadius: '8px',
              backgroundColor: activeSubTab === 'posted' ? 'var(--bg-card)' : 'transparent',
              color: activeSubTab === 'posted' ? 'var(--primary)' : 'var(--text-muted)',
              border: 'none',
              boxShadow: activeSubTab === 'posted' ? 'var(--shadow-sm)' : 'none',
              padding: '6px 16px',
            }}
          >
            Posted Tasks ({postedTasks.length})
          </button>
          <button
            onClick={() => setActiveSubTab('accepted')}
            className="btn btn-sm"
            style={{
              borderRadius: '8px',
              backgroundColor: activeSubTab === 'accepted' ? 'var(--bg-card)' : 'transparent',
              color: activeSubTab === 'accepted' ? 'var(--primary)' : 'var(--text-muted)',
              border: 'none',
              boxShadow: activeSubTab === 'accepted' ? 'var(--shadow-sm)' : 'none',
              padding: '6px 16px',
            }}
          >
            Accepted Tasks ({acceptedTasks.length})
          </button>
        </div>
      </div>

      {/* Task List Bento Grid */}
      <div className="tasks-grid">
        {displayedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onSelectTask={onSelectTask}
            onAcceptTask={onAcceptTask}
            onCompleteTask={onCompleteTask}
            onCallPoster={onCallPoster}
            onChatPoster={onChatPoster}
          />
        ))}

        {/* Add New Task Bento Box Card */}
        <div
          onClick={() => onNavigate('post')}
          style={{
            backgroundColor: 'rgba(22, 163, 74, 0.04)',
            borderRadius: '16px',
            border: '2px dashed rgba(22, 163, 74, 0.25)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'var(--transition)',
            minHeight: '220px',
          }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
          }}>
            <Plus style={{ width: '24px', height: '24px' }} />
          </div>
          <h3 className="h3-title">
            Post a New Task
          </h3>
          <p className="text-xs text-muted" style={{ maxWidth: '240px', marginTop: '4px' }}>
            Need help with groceries, repairs, or deliveries in your area?
          </p>
        </div>
      </div>
    </main>
  );
};
