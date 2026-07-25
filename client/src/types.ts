export type TaskStatus = 'pending' | 'accepted' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  status: TaskStatus;
  location: string;
  distance: string;
  time: string;
  postedAt: string;
  posterName: string;
  posterAvatar: string;
  posterRating?: number;
  posterReviewsCount?: number;
  posterPhone?: string;
  acceptedBy?: string;
  acceptedByAvatar?: string;
  requiredTools?: string;
  timeEstimate?: string;
  searchRadiusMiles?: number;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  count: number;
}

export interface Alert {
  id: string;
  type: 'task_accepted' | 'new_nearby' | 'payment_received' | 'task_completed' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionLabel?: string;
  taskId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  googleSignedIn: boolean;
  tasksPosted: number;
  tasksAccepted: number;
  tasksCompleted: number;
  rating: number;
  reviewsCount: number;
  memberSince: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  options?: string[];
}
