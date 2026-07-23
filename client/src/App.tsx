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

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(INITIAL_USER);
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
    }, 3000);
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
        message: `You accepted "${targetTask.title}". You can contact ${targetTask.posterName} via AI Assistant support or messages.`,
        time: 'Just now',
        read: false,
        taskId: taskId,
        actionLabel: 'View Task',
      };
      setAlerts((prev) => [newAlert, ...prev]);
    }

    showToast('Task accepted! Added to your Accepted Tasks.');
  };

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'postedAt'>) => {
    const createdTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      postedAt: 'Just now',
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
    setCurrentUser(user);
    setActiveTab('home');
    showToast(`Welcome back, ${user.name}!`);
  };

  const handleUserSignup = (user: UserProfile) => {
    setCurrentUser(user);
    setActiveTab('home');
    showToast(`Account created! Welcome to Hoply, ${user.name}!`);
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

      {/* Google Sign-In Modal */}
      <GoogleSignInModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        currentUser={currentUser || INITIAL_USER}
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
