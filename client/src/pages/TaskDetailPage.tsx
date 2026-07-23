import React from 'react';
import { Task } from '../types';
import { ArrowLeft, MapPin, Clock, CheckCircle2, Star, MessageSquare } from 'lucide-react';

interface TaskDetailPageProps {
  task: Task;
  onBack: () => void;
  onAcceptTask: (taskId: string) => void;
  onNavigate: (tab: string) => void;
}

export const TaskDetailPage: React.FC<TaskDetailPageProps> = ({
  task,
  onBack,
  onAcceptTask,
  onNavigate,
}) => {
  const isAccepted = task.status === 'accepted';
  const isCompleted = task.status === 'completed';

  return (
    <main className="page-container" style={{ paddingBottom: '96px' }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="btn btn-ghost btn-sm flex-row gap-2"
        style={{ marginBottom: '16px', alignSelf: 'flex-start' }}
      >
        <ArrowLeft style={{ width: '16px', height: '16px' }} />
        <span>Back to Tasks</span>
      </button>

      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '32px' }}>
        {/* Left Column: Interactive Map Preview */}
        <div style={{ flex: '1 1 350px', minWidth: '300px' }}>
          <div style={{ backgroundColor: 'var(--bg-muted)', borderRadius: '16px', border: '1px solid var(--border-color)', height: '384px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
            {/* Map visual representation */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--bg-muted), rgba(22, 163, 74, 0.05))', opacity: 0.9 }} />
            <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

            {/* Glowing Map Pin */}
            <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', inset: '-8px', borderRadius: '50%', backgroundColor: 'rgba(22, 163, 74, 0.2)' }} className="animate-pulse-subtle" />
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifycontent: 'center', border: '2px solid #fff', boxShadow: 'var(--shadow-lg)' }}>
                  <MapPin style={{ width: '24px', height: '24px', margin: '10px' }} />
                </div>
              </div>
              <span style={{ marginTop: '8px', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-main)', backgroundColor: 'var(--bg-card)', padding: '4px 12px', borderRadius: '9999px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
                {task.location}
              </span>
            </div>

            {/* Distance badge */}
            <div style={{ position: 'absolute', bottom: '16px', right: '16px', zIndex: 10, backgroundColor: 'var(--bg-card)', padding: '6px 12px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-main)' }}>
              <MapPin style={{ width: '14px', height: '14px', color: 'var(--primary)' }} />
              <span>{task.distance} away</span>
            </div>
          </div>
        </div>

        {/* Right Column: Task Information */}
        <div style={{ flex: '1.2 1.2 400px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Header Info */}
          <div>
            <div className="flex-row gap-2" style={{ marginBottom: '8px' }}>
              <span className="badge badge-green">
                {task.category}
              </span>
              <span className="text-xs text-muted flex-row gap-1">
                <Clock style={{ width: '14px', height: '14px' }} />
                <span>Posted {task.postedAt}</span>
              </span>
            </div>

            <h1 className="h1-title" style={{ fontSize: '1.75rem', lineHeight: '1.3' }}>
              {task.title}
            </h1>

            {/* Poster Info Card */}
            <div className="flex-row gap-3" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <img
                src={task.posterAvatar}
                alt={task.posterName}
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }}
              />
              <div>
                <h4 className="text-bold text-sm" style={{ color: 'var(--text-main)' }}>
                  {task.posterName}
                </h4>
                <div className="flex-row gap-1 text-xs text-bold" style={{ color: 'var(--warning)', marginTop: '2px' }}>
                  <Star style={{ width: '14px', height: '14px', fill: 'var(--warning)', color: 'var(--warning)' }} />
                  <span>{task.posterRating || 4.9}</span>
                  <span className="text-light" style={{ fontWeight: 'normal' }}>
                    ({task.posterReviewsCount || 12} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Details Bento Box */}
          <div className="bento-grid">
            <div className="bento-item">
              <span className="bento-label">
                Estimated Budget
              </span>
              <span className="bento-value highlight">
                Rs. {task.budget}.00
              </span>
            </div>

            <div className="bento-item">
              <span className="bento-label">
                Time Estimate
              </span>
              <span className="bento-value">
                {task.timeEstimate || '1 - 2 Hours'}
              </span>
            </div>

            <div className="bento-item" style={{ marginTop: '8px' }}>
              <span className="bento-label">
                Required Equipment
              </span>
              <span className="text-xs text-bold" style={{ color: 'var(--text-main)' }}>
                {task.requiredTools || 'Provided by task owner'}
              </span>
            </div>

            <div className="bento-item" style={{ marginTop: '8px' }}>
              <span className="bento-label">
                Date & Time Needed
              </span>
              <span className="text-xs text-bold" style={{ color: 'var(--text-main)' }}>
                {task.time}
              </span>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="flex-col gap-2">
            <h3 className="h3-title">
              Description & Instructions
            </h3>
            <p className="text-sm text-muted" style={{ lineHeight: '1.6' }}>
              {task.description}
            </p>
          </div>

          {/* Action Bar */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {!isAccepted && !isCompleted && (
              <button
                onClick={() => onAcceptTask(task.id)}
                className="btn btn-primary btn-lg flex-row gap-2"
                style={{ width: '100%', padding: '16px' }}
              >
                <CheckCircle2 style={{ width: '20px', height: '20px' }} />
                <span>Accept & Start Task (Rs. {task.budget})</span>
              </button>
            )}

            {isAccepted && (
              <div className="flex-col gap-2" style={{ width: '100%' }}>
                <div className="badge badge-green" style={{ width: '100%', padding: '12px', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px' }}>
                  Task Currently In Progress
                </div>
                <button
                  onClick={() => onNavigate('assistant')}
                  className="btn btn-outline btn-md flex-row gap-2"
                  style={{ width: '100%' }}
                >
                  <MessageSquare style={{ width: '16px', height: '16px' }} />
                  <span>Contact Task Poster ({task.posterName})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
