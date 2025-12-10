import React from 'react';

export type Language = 'en' | 'bn';

export interface Service {
  title: string;
  description: string;
  icon: React.ElementType;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image_url?: string;
  // Optional multilingual fields
  title_bn?: string;
  excerpt_bn?: string;
}

export interface GeminiChatProps {
  onAdminTrigger: () => void;
  language: Language;
}

export interface BlogProps {
  isAdmin: boolean;
  onPostClick: (post: BlogPost) => void;
  isFullView?: boolean;
  onViewAll?: () => void;
  onBack?: () => void;
  language: Language;
  onToggleLanguage?: () => void;
}

export interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export interface SinglePostProps {
  postId: string;
  initialPost?: BlogPost | null;
  onBack: () => void;
  language: Language;
  onToggleLanguage?: () => void;
}

export enum SectionId {
  HERO = 'hero',
  SERVICES = 'services',
  EXPERIENCE = 'experience',
  BLOG = 'blog',
  CONTACT = 'contact',
  AI_CHAT = 'ai-chat'
}

export interface HeroProps {
  language: Language;
}

export interface ServicesProps {
  language: Language;
}

export interface ExperienceProps {
  language: Language;
}

export interface ContactProps {
  language: Language;
}