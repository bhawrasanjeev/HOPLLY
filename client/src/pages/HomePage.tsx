import React, { useState } from 'react';
import { Search, Plus, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { Task, Category, UserProfile } from '../types';
import { TaskCard } from '../components/TaskCard';
import { Chip } from '../components/UiComponents';

interface HomePageProps {
  tasks: Task[];
  categories: Category[];
  currentUser: UserProfile | null;
  onSelectTask: (task: Task) => void;
  onAcceptTask: (taskId: string, e: React.MouseEvent) => void;
  onNavigate: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  tasks,
  categories,
  currentUser,
  onSelectTask,
  onAcceptTask,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const userName = currentUser ? currentUser.name.split(' ')[0] : 'Neighbor';

  const filteredTasks = tasks.filter((t) => {
    const matchesQuery =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory
      ? t.category.toLowerCase() === selectedCategory.toLowerCase()
      : true;

    return matchesQuery && matchesCategory;
  });

  return (
    <main className="page-container">
      {/* Greeting & Search Bar */}
      <section className="flex-col gap-4">
        <div>
          <h1 className="h1-title">
            Hello, {userName} 👋
          </h1>
          <p className="text-sm text-muted" style={{ marginTop: '4px' }}>
            What do you need help with today in your neighborhood?
          </p>
        </div>

        <div style={{ position: 'relative', maxWidth: '672px' }}>
          <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', width: '18px', height: '18px' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for services, tasks (e.g. Whole Foods, plumber, dog walk)..."
            className="form-input"
            style={{ paddingLeft: '48px', height: '48px', borderRadius: '16px' }}
          />
        </div>
      </section>

      {/* Category Pills Row */}
      <section className="flex-col gap-3">
        <div className="flex-between">
          <h2 className="h2-title" style={{ fontSize: '1.15rem' }}>Categories</h2>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--primary)', fontWeight: 'bold', padding: '4px 8px' }}
            >
              Clear Filter
            </button>
          )}
        </div>

        <div className="flex-row gap-2 no-scrollbar" style={{ overflowX: 'auto', paddingBottom: '8px' }}>
          <Chip
            label="All Categories"
            active={selectedCategory === null}
            onClick={() => setSelectedCategory(null)}
          />
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.name}
              active={selectedCategory?.toLowerCase() === cat.name.toLowerCase()}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory?.toLowerCase() === cat.name.toLowerCase()
                    ? null
                    : cat.name
                )
              }
            />
          ))}
        </div>
      </section>

      {/* CTA Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-text-wrap">
            <span className="hero-pill">
              Hyperlocal Community
            </span>
            <h2 className="hero-title">
              Need something done fast?
            </h2>
            <p className="hero-description">
              Post your task and get verified local helpers to respond within minutes.
            </p>
          </div>
          <button
            onClick={() => onNavigate('post')}
            className="hero-btn"
          >
            <Plus style={{ width: '20px', height: '20px' }} />
            <span>Post a Task</span>
          </button>
        </div>
        {/* Background decorative circles */}
        <div className="hero-circle-deco" />
      </section>

      {/* Nearby Tasks Grid */}
      <section className="flex-col gap-4">
        <div className="flex-between">
          <div className="flex-row gap-2">
            <MapPin style={{ width: '20px', height: '20px', color: 'var(--primary)' }} />
            <h2 className="h2-title" style={{ fontSize: '1.15rem' }}>
              Nearby Tasks
            </h2>
            <span className="badge badge-gray" style={{ marginLeft: '4px' }}>
              {filteredTasks.length}
            </span>
          </div>

          <button
            onClick={() => onNavigate('tasks')}
            className="btn btn-ghost btn-sm flex-row gap-1"
            style={{ color: 'var(--primary)', fontWeight: 'bold' }}
          >
            <span>View All</span>
            <ArrowRight style={{ width: '14px', height: '14px' }} />
          </button>
        </div>

        {filteredTasks.length > 0 ? (
          <div className="tasks-grid">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onSelectTask={onSelectTask}
                onAcceptTask={onAcceptTask}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state-card">
            <div className="empty-state-icon">
              <Search style={{ width: '24px', height: '24px' }} />
            </div>
            <h3 className="h3-title">
              No tasks found
            </h3>
            <p className="text-xs text-muted">
              Try adjusting your search terms or clearing category filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
              className="btn btn-primary btn-sm"
              style={{ marginTop: '8px' }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Floating AI Support Trigger */}
      <button
        onClick={() => onNavigate('assistant')}
        className="ai-floating-btn"
        title="Ask Hoply AI Assistant"
      >
        <Sparkles style={{ width: '24px', height: '24px' }} />
      </button>
    </main>
  );
};
