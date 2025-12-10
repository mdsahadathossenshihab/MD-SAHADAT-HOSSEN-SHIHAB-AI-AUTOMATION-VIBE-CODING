import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Tag, Share2, Loader2, Clock, AlertTriangle, Globe, Sparkles } from 'lucide-react';
import { supabase, DEMO_POSTS } from '../services/supabaseClient';
import { BlogPost, SinglePostProps } from '../types';
import { translations } from '../utils/translations';
import { generateTranslation } from '../services/geminiService';

export const SinglePost: React.FC<SinglePostProps> = ({ postId, initialPost, onBack, language, onToggleLanguage }) => {
  const [post, setPost] = useState<BlogPost | null>(initialPost || null);
  // If we have initialPost, we are NOT loading. If we don't, we ARE loading.
  const [isLoading, setIsLoading] = useState(!initialPost);
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const t = translations[language].blog;

  // Initial Fetch Logic
  useEffect(() => {
    // If we already have the post data passed from props
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
            title_bn: data.title_bn,
            category: data.category,
            excerpt: data.excerpt,
            excerpt_bn: data.excerpt_bn,
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

  // Auto-Translation Logic
  useEffect(() => {
    if (language === 'bn' && post && !isTranslating) {
      if (!post.title_bn || post.title_bn.trim() === '') {
        performTranslation();
      }
    }
  }, [language, post]);

  const performTranslation = async () => {
    if (!post) return;
    setIsTranslating(true);
    
    try {
      const translated = await generateTranslation(post.title, post.excerpt);
      
      if (translated) {
        setPost(prev => prev ? ({
          ...prev,
          title_bn: translated.title_bn,
          excerpt_bn: translated.excerpt_bn
        }) : null);

        // Attempt silent save to DB (best effort)
        supabase
          .from('posts')
          .update({ 
            title_bn: translated.title_bn, 
            excerpt_bn: translated.excerpt_bn 
          })
          .eq('id', post.id)
          .then(({ error }) => {
             if (error) console.warn("Background save failed:", error.message);
          });
      }
    } catch (error) {
      console.error("Single post translation failed", error);
    } finally {
      setIsTranslating(false);
    }
  };

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
        <h2 className="text-2xl font-bold mb-4">{t.post_not_found}</h2>
        <button onClick={onBack} className="text-blue-600 font-bold hover:underline">{t.return_home}</button>
      </div>
    );
  }

  // Determine content based on language
  const hasBengali = post.title_bn && post.title_bn.trim() !== '';
  const showBengali = language === 'bn' && hasBengali;

  const displayTitle = showBengali ? post.title_bn : post.title;
  const displayExcerpt = showBengali ? post.excerpt_bn : post.excerpt;

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20 animate-in fade-in duration-300">
      {/* Navbar Placeholder for Back Button */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold transition-colors"
        >
          <ArrowLeft size={20} /> {t.back_home}
        </button>

        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          {onToggleLanguage && (
            <button 
              onClick={onToggleLanguage}
              className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors border border-slate-200 mr-2"
            >
              <Globe size={14} className="text-slate-600" />
              <span className={language === 'en' ? 'text-indigo-600' : 'text-slate-500'}>EN</span>
              <span className="text-slate-300">|</span>
              <span className={language === 'bn' ? 'text-indigo-600' : 'text-slate-500'}>BN</span>
            </button>
          )}
          
          {/* Translation Status */}
          {language === 'bn' && isTranslating && (
             <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold animate-pulse">
                <Loader2 size={12} className="animate-spin" />
                Translating...
             </div>
          )}

          {isDemo && (
            <span className="text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-xs font-bold border border-orange-100 flex items-center gap-1">
              <AlertTriangle size={12} /> {t.demo_badge}
            </span>
          )}
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-full text-sm font-bold text-slate-700 transition-colors"
          >
            {copied ? <span className="text-green-600">{t.copied}</span> : <><Share2 size={16} /> {t.share}</>}
          </button>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 mt-8">
        {post.image_url && (
          <div className="w-full h-[400px] rounded-3xl overflow-hidden mb-10 shadow-xl shadow-slate-200">
            <img src={post.image_url} alt={displayTitle} className="w-full h-full object-cover" />
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
            {displayTitle}
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full mx-auto"></div>
        </header>

        <div className="prose prose-lg prose-slate mx-auto">
           {displayExcerpt?.split('\n').map((para, i) => (
             <p key={i} className="mb-6 leading-loose text-slate-700 text-lg">
               {para}
             </p>
           ))}
        </div>
      </article>
    </div>
  );
};