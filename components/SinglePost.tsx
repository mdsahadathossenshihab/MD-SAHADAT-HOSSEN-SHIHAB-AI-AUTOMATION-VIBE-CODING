import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Tag, Share2, Loader2, Clock, AlertTriangle } from 'lucide-react';
import { supabase, DEMO_POSTS } from '../services/supabaseClient';
import { BlogPost, SinglePostProps } from '../types';

export const SinglePost: React.FC<SinglePostProps> = ({ postId, initialPost, onBack }) => {
  const [post, setPost] = useState<BlogPost | null>(initialPost || null);
  // If we have initialPost, we are NOT loading. If we don't, we ARE loading.
  const [isLoading, setIsLoading] = useState(!initialPost);
  const [copied, setCopied] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    // If we already have the post data passed from props, no need to fetch!
    if (initialPost) {
      setPost(initialPost);
      setIsLoading(false);
      return;
    }

    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', postId)
          .single();

        if (error) throw error;
        
        if (data) {
          setPost({
            id: data.id,
            title: data.title,
            category: data.category,
            excerpt: data.excerpt,
            date: data.date || new Date(data.created_at).toLocaleDateString(),
            image_url: data.image_url
          });
        }
      } catch (err) {
        console.warn("Error fetching post from Supabase, checking demo data:", err);
        // Fallback to Demo Data
        const demoPost = DEMO_POSTS.find(p => p.id.toString() === postId.toString());
        if (demoPost) {
          setPost(demoPost);
          setIsDemo(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId, initialPost]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-900">
        <h2 className="text-2xl font-bold mb-4">Post not found</h2>
        <button onClick={onBack} className="text-blue-600 font-bold hover:underline">Return Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20 animate-in fade-in duration-300">
      {/* Navbar Placeholder for Back Button */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold transition-colors"
        >
          <ArrowLeft size={20} /> Back to Home
        </button>
        <div className="flex items-center gap-3">
          {isDemo && (
            <span className="text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-xs font-bold border border-orange-100 flex items-center gap-1">
              <AlertTriangle size={12} /> Demo Content
            </span>
          )}
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-full text-sm font-bold text-slate-700 transition-colors"
          >
            {copied ? <span className="text-green-600">Copied!</span> : <><Share2 size={16} /> Share</>}
          </button>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 mt-8">
        {post.image_url && (
          <div className="w-full h-[400px] rounded-3xl overflow-hidden mb-10 shadow-xl shadow-slate-200">
            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <header className="mb-10 text-center max-w-2xl mx-auto">
          <div className="flex justify-center gap-3 mb-6">
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Tag size={12} /> {post.category}
            </span>
            <span className="bg-slate-50 text-slate-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Clock size={12} /> {post.date}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
            {post.title}
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full mx-auto"></div>
        </header>

        <div className="prose prose-lg prose-slate mx-auto">
           {post.excerpt.split('\n').map((para, i) => (
             <p key={i} className="mb-6 leading-loose text-slate-700 text-lg">
               {para}
             </p>
           ))}
        </div>
      </article>
    </div>
  );
};