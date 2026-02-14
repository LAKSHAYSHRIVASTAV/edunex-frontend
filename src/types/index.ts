export interface StudyData {
  subject: string;
  hoursStudied: number;
  progress: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  studyData: StudyData[];
}

export interface AnalyticsData {
  subject: string;
  completedTasks: number;
  totalTasks: number;
}

export interface Progress {
  date: string;
  progressPercentage: number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

export interface ButtonProps {
  onClick: () => void;
  label: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export interface CardProps {
  title: string;
  content: React.ReactNode;
  actions?: React.ReactNode;
}