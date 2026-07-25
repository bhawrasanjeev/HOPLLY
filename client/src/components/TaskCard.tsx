import React from 'react';
import { MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onSelectTask: (task: Task) => void;
  onAcceptTask: (taskId: string, e: React.MouseEvent) => void;
  onCompleteTask?: (taskId: string, e: React.MouseEvent) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onSelectTask,
  onAcceptTask,
  onCompleteTask,
}) => {
  const isPending = task.status === 'pending';
  const isAccepted = task.status === 'accepted';
  const isCompleted = task.status === 'completed';

  return (
    <article
      onClick={() => onSelectTask(task)}
      className="task-card"
    >
      <div>
        {/* Top Header Row */}
        <div className="flex-between gap-3" style={{ marginBottom: '12px', alignItems: 'flex-start' }}>
          <div className="flex-col gap-1 min-w-0" style={{ alignItems: 'flex-start' }}>
            <span className="badge badge-green" style={{ width: 'fit-content' }}>
              {task.category}
            </span>
            <h3 className="task-card-title">
              {task.title}
            </h3>
          </div>
          <div className="shrink-0" style={{ textAlign: 'right' }}>
            <div className="task-card-budget">
              Rs. {task.budget}
            </div>
            <div className="text-xs text-muted" style={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Est.
            </div>
          </div>
        </div>

        {/* Task Description excerpt */}
        <p className="task-card-desc">
          {task.description}
        </p>
      </div>

      {/* Metadata & Actions */}
      <div>
        <div className="task-card-footer" style={{ marginBottom: '12px' }}>
          <div className="flex-row gap-1">
            <MapPin style={{ width: '14px', height: '14px', color: 'var(--primary)', flexShrink: 0 }} />
            <span>{task.distance}</span>
          </div>
          <div className="flex-row gap-1">
            <Clock style={{ width: '14px', height: '14px', color: 'var(--primary)', flexShrink: 0 }} />
            <span>{task.time}</span>
          </div>
        </div>

        {/* Action Button depending on status */}
        {isPending && (
          <button
            onClick={(e) => onAcceptTask(task.id, e)}
            className="btn btn-primary btn-sm flex-row gap-1.5"
            style={{ width: '100%' }}
          >
            <CheckCircle2 style={{ width: '16px', height: '16px' }} />
            <span>Accept Task</span>
          </button>
        )}

        {isAccepted && (
          <div className="flex-col gap-1.5" style={{ width: '100%' }}>
            {onCompleteTask && (
              <button
                onClick={(e) => onCompleteTask(task.id, e)}
                className="btn btn-primary btn-sm flex-row gap-1.5"
                style={{ width: '100%', backgroundColor: 'var(--primary-hover)' }}
              >
                <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                <span>Mark as Completed</span>
              </button>
            )}
            <div className="badge badge-green" style={{ width: '100%', padding: '6px', display: 'flex', justifyContent: 'center', gap: '6px' }}>
              <CheckCircle2 style={{ width: '14px', height: '14px' }} />
              <span>In Progress ({task.acceptedBy || 'Accepted'})</span>
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="badge badge-gray" style={{ width: '100%', padding: '8px', display: 'flex', justifyContent: 'center', gap: '6px' }}>
            <CheckCircle2 style={{ width: '16px', height: '16px', color: 'var(--primary)' }} />
            <span>Task Completed</span>
          </div>
        )}
      </div>
    </article>
  );
};
