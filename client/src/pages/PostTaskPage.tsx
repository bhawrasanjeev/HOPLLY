import React, { useState } from 'react';
import { Sparkles, MapPin, Send, CheckCircle2, ChevronDown } from 'lucide-react';
import { Category, Task, UserProfile } from '../types';
import { AiSuggestModal } from '../components/AiSuggestModal';

interface PostTaskPageProps {
  categories: Category[];
  currentUser: UserProfile | null;
  onAddTask: (newTask: Omit<Task, 'id' | 'postedAt'>) => void;
  onNavigate: (tab: string) => void;
}

export const PostTaskPage: React.FC<PostTaskPageProps> = ({
  categories,
  currentUser,
  onAddTask,
  onNavigate,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [budget, setBudget] = useState<number | ''>('');
  const [location, setLocation] = useState('142 Oak Drive, Springfield');
  const [searchRadius, setSearchRadius] = useState<number>(5);

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category || !budget) return;

    onAddTask({
      title,
      description,
      category,
      budget: Number(budget),
      status: 'pending',
      location: location || 'Nearby Neighborhood',
      distance: '0.5 mi',
      time: 'Flexible Today',
      posterName: currentUser ? currentUser.name : 'Community Member',
      posterAvatar:
        currentUser?.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      posterRating: currentUser?.rating || 5.0,
      posterReviewsCount: currentUser?.reviewsCount || 0,
      searchRadiusMiles: searchRadius,
      requiredTools: 'Standard tools if applicable',
      timeEstimate: '1 - 2 hours',
    });

    setIsSuccess(true);
    setTimeout(() => {
      onNavigate('home');
    }, 1500);
  };

  const handleApplyAiSuggestions = (sug: {
    category: string;
    suggestedBudget: number;
    searchRadiusMiles: number;
  }) => {
    setCategory(sug.category);
    setBudget(sug.suggestedBudget);
    setSearchRadius(sug.searchRadiusMiles);
  };

  if (isSuccess) {
    return (
      <div className="empty-state-card" style={{ marginTop: '64px' }}>
        <div className="empty-state-icon" style={{ width: '80px', height: '80px', borderRadius: '50%' }}>
          <CheckCircle2 style={{ width: '40px', height: '40px' }} />
        </div>
        <h2 className="h1-title" style={{ fontSize: '1.5rem' }}>
          Task Posted Successfully!
        </h2>
        <p className="text-sm text-muted">
          Your request is now live for nearby verified Hoply helpers. Redirecting...
        </p>
      </div>
    );
  }

  return (
    <main className="page-container" style={{ maxWidth: '768px' }}>
      <div className="flex-between">
        <div>
          <h1 className="h1-title">Post a Task</h1>
          <p className="text-sm text-muted" style={{ marginTop: '4px' }}>
            Describe what you need done and connect with local verified helpers.
          </p>
        </div>

        {/* AI Suggest Pill */}
        <button
          type="button"
          onClick={() => setIsAiModalOpen(true)}
          className="btn btn-secondary btn-sm flex-row gap-1.5 animate-pulse-subtle"
          style={{ borderRadius: '9999px', border: '1px solid rgba(22, 163, 74, 0.3)' }}
        >
          <Sparkles style={{ width: '14px', height: '14px', color: 'var(--primary)' }} />
          <span>AI Task Suggestion</span>
        </button>
      </div>

      {/* Main Form Container */}
      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '24px' }}>
        <form onSubmit={handleSubmit} className="flex-col gap-5">
          {/* Task Title */}
          <div className="form-group">
            <label className="form-label">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Assemble IKEA PAX Closet or Pick up Whole Foods Groceries"
              className="form-input"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide key details, timing preferences, and any specific instructions..."
              className="form-textarea"
            />
          </div>

          {/* Category & Budget Row */}
          <div className="grid-sm-2 gap-4" style={{ display: 'grid' }}>
            <div className="form-group">
              <label className="form-label">
                Category *
              </label>
              <div className="select-wrapper">
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-select"
                  style={{ paddingRight: '40px' }}
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                  <option value="Handyman">Handyman</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Pet Care">Pet Care</option>
                  <option value="Grocery">Grocery</option>
                </select>
                <ChevronDown className="select-arrow" style={{ width: '16px', height: '16px' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Estimated Budget (Rs.) *
              </label>
              <input
                type="number"
                required
                min={5}
                step={5}
                value={budget}
                onChange={(e) => setBudget(e.target.value ? Number(e.target.value) : '')}
                placeholder="Rs. 0"
                className="form-input"
              />
            </div>
          </div>

          {/* Location Search */}
          <div className="form-group">
            <label className="form-label">
              Task Location
            </label>
            <div style={{ position: 'relative' }}>
              <MapPin style={{ width: '16px', height: '16px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search address or neighborhood..."
                className="form-input"
                style={{ paddingLeft: '36px' }}
              />
            </div>
          </div>

          {/* Search Radius Slider */}
          <div className="form-group" style={{ gap: '8px' }}>
            <div className="flex-between">
              <span className="form-label" style={{ margin: 0 }}>
                Search Radius
              </span>
              <span className="text-bold" style={{ color: 'var(--primary)', fontSize: '12px' }}>{searchRadius} Miles</span>
            </div>
            <input
              type="range"
              min={1}
              max={25}
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
          </div>

          {/* Submit Action */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '8px' }}>
            <button
              type="submit"
              className="btn btn-primary btn-md flex-row gap-2"
              style={{ width: '100%' }}
            >
              <span>Post Task Now</span>
              <Send style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </form>
      </div>

      {/* AI Suggestion Modal */}
      <AiSuggestModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApply={handleApplyAiSuggestions}
        taskTitle={title}
        taskDesc={description}
      />
    </main>
  );
};
