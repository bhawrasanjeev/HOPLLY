import React, { useState } from 'react';
import { Alert } from '../types';
import { Bell, CheckCircle2, Navigation, IndianRupee, ArrowRight } from 'lucide-react';
import './AlertsPage.css';

interface AlertsPageProps {
  alerts: Alert[];
  onMarkAllRead: () => void;
  onNavigate: (tab: string) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  alerts,
  onMarkAllRead,
  onNavigate,
}) => {
  const [localAlerts, setLocalAlerts] = useState<Alert[]>(alerts);

  const handleToggleRead = (id: string) => {
    setLocalAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  };

  const handleMarkAll = () => {
    setLocalAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
    onMarkAllRead();
  };

  const iconColors = {
    task_accepted: { bg: 'rgba(22, 163, 74, 0.1)', text: 'var(--primary)' },
    task_completed: { bg: 'rgba(22, 163, 74, 0.1)', text: 'var(--primary)' },
    payment_received: { bg: 'rgba(245, 158, 11, 0.1)', text: 'var(--warning-text)' },
    new_nearby: { bg: 'rgba(59, 130, 246, 0.1)', text: '#2563eb' },
    system: { bg: 'var(--bg-muted)', text: 'var(--text-muted)' },
  };

  return (
    <main className="page-container" style={{ maxWidth: '768px' }}>
      <div className="flex-between">
        <div>
          <h1 className="h1-title">Alerts</h1>
          <p className="text-sm text-muted" style={{ marginTop: '4px' }}>
            Real-time updates regarding your posted tasks and local matches.
          </p>
        </div>
        <button
          onClick={handleMarkAll}
          className="btn btn-ghost btn-sm"
          style={{ color: 'var(--primary)', fontWeight: 'bold' }}
        >
          Mark all as read
        </button>
      </div>

      {/* Alerts Stream */}
      <div className="flex-col gap-3">
        {localAlerts.map((alert) => {
          const colors = iconColors[alert.type as keyof typeof iconColors] || { bg: 'var(--bg-muted)', text: 'var(--text-muted)' };
          return (
            <div
              key={alert.id}
              onClick={() => handleToggleRead(alert.id)}
              className={`alert-card ${!alert.read ? 'unread' : ''}`}
              style={{
                opacity: alert.read ? 0.75 : 1,
                backgroundColor: alert.read ? 'var(--bg-muted)' : 'var(--bg-card)',
                border: alert.read ? '1px solid var(--border-color)' : '1px solid rgba(22, 163, 74, 0.3)',
                flexDirection: 'row',
                display: 'flex',
              }}
            >
              {/* Icon Circle */}
              <div
                className="alert-icon-wrap"
                style={{ backgroundColor: colors.bg, color: colors.text }}
              >
                {alert.type === 'task_accepted' && <CheckCircle2 style={{ width: '20px', height: '20px' }} />}
                {alert.type === 'new_nearby' && <Navigation style={{ width: '20px', height: '20px' }} />}
                {alert.type === 'payment_received' && <IndianRupee style={{ width: '20px', height: '20px' }} />}
                {alert.type === 'task_completed' && <CheckCircle2 style={{ width: '20px', height: '20px' }} />}
                {alert.type === 'system' && <Bell style={{ width: '20px', height: '20px' }} />}
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0" style={{ marginLeft: '12px' }}>
                <div className="flex-between" style={{ alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                  <h3 className="text-bold text-sm" style={{ color: 'var(--text-main)' }}>
                    {alert.title}
                  </h3>
                  <span className="text-xs text-muted" style={{ whiteSpace: 'nowrap' }}>
                    {alert.time}
                  </span>
                </div>
                <p className="text-xs text-muted" style={{ lineHeight: '1.5', marginBottom: alert.actionLabel ? '12px' : '0' }}>
                  {alert.message}
                </p>

                {/* Inline Quick Action Buttons */}
                {alert.actionLabel && (
                  <div className="flex-row gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (alert.taskId) onNavigate('tasks');
                        else onNavigate('assistant');
                      }}
                      className="btn btn-primary btn-sm flex-row gap-1"
                    >
                      <span>{alert.actionLabel}</span>
                      <ArrowRight style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};
