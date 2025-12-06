import { createClient } from '@supabase/supabase-js';
import { BlogPost } from '../types';

const supabaseUrl = 'https://oszwxszetdqkrefkjbaf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zend4c3pldGRxa3JlZmtqYmFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4Njg0NDAsImV4cCI6MjA4MDQ0NDQ0MH0.CiEI7xxPP1f5XE-DrqwPY6ctWpPpaKOdu2OUOaWyNVY';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Fallback data in case Supabase connection fails (for Portfolio Demo purposes)
export const DEMO_POSTS: BlogPost[] = [
  {
    id: 101,
    title: "Building Autonomous Agents with n8n",
    category: "Automation",
    excerpt: "Discover how to chain AI agents together to perform complex research and reporting tasks automatically using n8n workflows. We explore webhook triggers, JSON parsing, and LLM integration.",
    date: "Oct 24, 2023",
    image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: 102,
    title: "The Rise of Vibe Coding",
    category: "Development",
    excerpt: "Why spending time on 'vibes', aesthetics, and UI polish matters more than ever in the age of AI-generated code. A look at how tools like Cursor and v0 are changing the game.",
    date: "Nov 12, 2023",
    image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: 103,
    title: "Supabase + React: The Perfect Duo",
    category: "Tech Stack",
    excerpt: "A deep dive into why I chose Supabase as the backend for my high-performance client projects. From Row Level Security (RLS) to real-time subscriptions.",
    date: "Dec 05, 2023",
    image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: 104,
    title: "Automating Customer Support with Gemini",
    category: "AI Chatbots",
    excerpt: "How to reduce support tickets by 60% using a custom knowledge base and Google's Gemini Flash model. Implementation guide included.",
    date: "Jan 15, 2024",
    image_url: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=1000"
  }
];