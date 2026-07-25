import React, { useState } from 'react';
import { Task, Category, Alert, UserProfile } from './types';
import { INITIAL_USER, CATEGORIES, INITIAL_TASKS, INITIAL_ALERTS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { GoogleSignInModal } from './components/GoogleSignInModal';
import { AiSuggestModal } from './components/AiSuggestModal';

import { HomePage } from './pages/HomePage';
import { TasksPage } from './pages/TasksPage';
import { PostTaskPage } from './pages/PostTaskPage';
import { AlertsPage } from './pages/AlertsPage';
import { ProfilePage } from './pages/ProfilePage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { AssistantPage } from './pages/AssistantPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

const DEFAULT_ACCOUNTS: UserProfile[] = [
  INITIAL_USER,
  {
    id: 'usr_jane',
    name: 'Jane Doe',
    email: 'jane.doe@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    googleSignedIn: true,
    tasksPosted: 10,
    tasksAccepted: 14,
    tasksCompleted: 24,
    rating: 4.8,
    reviewsCount: 19,
    memberSince: 'Jan 2024',
  },
  {
    id: 'usr_alex',
    name: 'Alex M. Helper',
    email: 'alex.helper@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    googleSignedIn: true,
    tasksPosted: 5,
    tasksAccepted: 32,
    tasksCompleted: 37,
    rating: 5.0,
    reviewsCount: 45,
    memberSince: 'Feb 2024',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(INITIAL_USER);
  const [userAccounts, setUserAccounts] = useState<UserProfile[]>(DEFAULT_ACCOUNTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Modals state
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  // Toast banner state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const registerOrUpdateAccountList = (user: UserProfile) => {
    setUserAccounts((prev) => {
      const exists = prev.some((acc) => acc.email.toLowerCase() === user.email.toLowerCase());
      if (exists) {
        return prev.map((acc) => (acc.email.toLowerCase() === user.email.toLowerCase() ? user : acc));
      }
      return [...prev, user];
    });
  };

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setActiveTab('detail');
  };

  const handleAcceptTask = (taskId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const currentUserName = currentUser ? currentUser.name : 'Community Member';
    const currentUserAvatar = currentUser ? currentUser.avatar : '';

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: 'accepted',
            acceptedBy: currentUserName,
            acceptedByAvatar: currentUserAvatar,
          };
        }
        return t;
      })
    );

    // Update user stats if logged in
    if (currentUser) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              tasksAccepted: prev.tasksAccepted + 1,
            }
          : null
      );
    }

    // Add alert
    const targetTask = tasks.find((t) => t.id === taskId);
    if (targetTask) {
      const newAlert: Alert = {
        id: `alt-${Date.now()}`,
        type: 'task_accepted',
        title: 'Task Accepted Successfully',
        message: `You accepted "${targetTask.title}". Contact ${targetTask.posterName} at ${targetTask.posterPhone || '+91 98765 43210'}.`,
        time: 'Just now',
        read: false,
        taskId: taskId,
        actionLabel: 'View Task',
      };
      setAlerts((prev) => [newAlert, ...prev]);
    }

    showToast('Task accepted! Added to your Accepted Tasks.');
  };

  const handleCompleteTask = (taskId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: 'completed',
          };
        }
        return t;
      })
    );

    if (currentUser) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              tasksCompleted: prev.tasksCompleted + 1,
            }
          : null
      );
    }

    // Trigger completion alert
    const newAlert: Alert = {
      id: `alt-${Date.now()}`,
      type: 'task_completed',
      title: 'Task Completed & Payment Released',
      message: `"${targetTask.title}" is marked as complete. Compensation of Rs. ${targetTask.budget}.00 processed.`,
      time: 'Just now',
      read: false,
      taskId: taskId,
      actionLabel: 'Leave Review',
    };
    setAlerts((prev) => [newAlert, ...prev]);

    showToast(`Task completed! Rs. ${targetTask.budget} payment processed.`);
  };

  const handleCallPoster = (phone: string, posterName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    showToast(`📞 Calling ${posterName} at ${phone}...`);
    setTimeout(() => {
      window.location.href = `tel:${phone.replace(/\s+/g, '')}`;
    }, 500);
  };

  const handleChatPoster = (posterName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    showToast(`💬 Demo Chat: Opening direct chat room with ${posterName}...`);
  };

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'postedAt'>) => {
    const createdTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      postedAt: 'Just now',
      posterPhone: currentUser?.email === 'bhawsanjeev102@gmail.com' ? '+91 98765 43210' : '+91 91234 56789',
    };

    setTasks((prev) => [createdTask, ...prev]);

    if (currentUser) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              tasksPosted: prev.tasksPosted + 1,
            }
          : null
      );
    }

    // Add system alert
    const newAlert: Alert = {
      id: `alt-${Date.now()}`,
      type: 'new_nearby',
      title: 'Your task is live!',
      message: `"${createdTask.title}" was posted to nearby helpers in your ${createdTask.searchRadiusMiles || 5}-mile radius.`,
      time: 'Just now',
      read: false,
      taskId: createdTask.id,
      actionLabel: 'View Details',
    };
    setAlerts((prev) => [newAlert, ...prev]);

    showToast('Task posted live to local neighborhood!');
  };

  const handleUserLogin = (user: UserProfile) => {
    registerOrUpdateAccountList(user);
    setCurrentUser(user);
    setActiveTab('home');
    showToast(`Welcome back, ${user.name}!`);
  };

  const handleUserSignup = (user: UserProfile) => {
    registerOrUpdateAccountList(user);
    setCurrentUser(user);
    setActiveTab('home');
    showToast(`Account created! Welcome to Hoplly, ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('login');
    showToast('You have been logged out.');
  };

  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="app-wrapper">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="toast-banner">
          <span className="toast-ping animate-pulse-subtle" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Top Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'detail') setSelectedTask(null);
        }}
        currentUser={currentUser}
        onOpenGoogleSignIn={() => setIsGoogleModalOpen(true)}
        unreadCount={unreadAlertsCount}
      />

      {/* Main Page Views Router */}
      <div className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            tasks={tasks}
            categories={CATEGORIES}
            currentUser={currentUser}
            onSelectTask={handleSelectTask}
            onAcceptTask={handleAcceptTask}
            onCompleteTask={handleCompleteTask}
            onCallPoster={handleCallPoster}
            onChatPoster={handleChatPoster}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'login' && (
          <LoginPage
            onLoginSuccess={handleUserLogin}
            onNavigateToSignup={() => setActiveTab('signup')}
            onOpenGoogleSignIn={() => setIsGoogleModalOpen(true)}
          />
        )}

        {activeTab === 'signup' && (
          <SignupPage
            onSignupSuccess={handleUserSignup}
            onNavigateToLogin={() => setActiveTab('login')}
            onOpenGoogleSignIn={() => setIsGoogleModalOpen(true)}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksPage
            tasks={tasks}
            currentUser={currentUser}
            onSelectTask={handleSelectTask}
            onAcceptTask={handleAcceptTask}
            onCompleteTask={handleCompleteTask}
            onCallPoster={handleCallPoster}
            onChatPoster={handleChatPoster}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'post' && (
          <PostTaskPage
            categories={CATEGORIES}
            currentUser={currentUser}
            onAddTask={handleAddTask}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsPage
            alerts={alerts}
            onMarkAllRead={() =>
              setAlerts((prev) => prev.map((a) => ({ ...a, read: true })))
            }
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'profile' && currentUser && (
          <ProfilePage
            currentUser={currentUser}
            onOpenGoogleSignIn={() => setIsGoogleModalOpen(true)}
            onLogout={handleLogout}
          />
        )}

        {activeTab === 'profile' && !currentUser && (
          <LoginPage
            onLoginSuccess={handleUserLogin}
            onNavigateToSignup={() => setActiveTab('signup')}
            onOpenGoogleSignIn={() => setIsGoogleModalOpen(true)}
          />
        )}

        {activeTab === 'assistant' && (
          <AssistantPage onNavigate={(tab) => setActiveTab(tab)} />
        )}

        {activeTab === 'detail' && selectedTask && (
          <TaskDetailPage
            task={selectedTask}
            onBack={() => setActiveTab('home')}
            onAcceptTask={(taskId) => {
              handleAcceptTask(taskId);
              setSelectedTask((prev) =>
                prev ? { ...prev, status: 'accepted', acceptedBy: currentUser?.name || 'User' } : null
              );
            }}
            onCompleteTask={(taskId) => {
              handleCompleteTask(taskId);
              setSelectedTask((prev) => (prev ? { ...prev, status: 'completed' } : null));
            }}
            onCallPoster={(phone, posterName) => handleCallPoster(phone, posterName)}
            onChatPoster={(posterName) => handleChatPoster(posterName)}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'detail') setSelectedTask(null);
        }}
        unreadCount={unreadAlertsCount}
      />

      {/* Google Sign-In / Account Switcher Modal */}
      <GoogleSignInModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        currentUser={currentUser || INITIAL_USER}
        availableAccounts={userAccounts}
        onLoginSuccess={(updatedUser) => {
          handleUserLogin(updatedUser);
        }}
      />

      {/* Standalone AI Suggestion Modal */}
      <AiSuggestModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApply={(sug) => {
          showToast(`AI Suggested Category: ${sug.category}, Budget: Rs. ${sug.suggestedBudget}`);
          setActiveTab('post');
        }}
      />
    </div>
  );
}
