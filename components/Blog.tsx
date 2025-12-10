import React, { useState, useEffect } from 'react';
import { ArrowRight, Calendar, Image as ImageIcon, Sparkles, AlertCircle, ArrowLeft, Globe, Loader2 } from 'lucide-react';
import { BlogPost, BlogProps } from '../types';
import { supabase, DEMO_POSTS } from '../services/supabaseClient';
import { translations } from '../utils/translations';
import { generateTranslation } from '../services/geminiService';

export const Blog: React.FC<BlogProps> = ({ isAdmin, onPostClick, isFullView = false, onViewAll, onBack, language, onToggleLanguage }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usingDemoData, setUsingDemoData] = useState(false);
  
  // Track which posts are currently being translated to avoid duplicate API calls
  const [translatingIds, setTranslatingIds] = useState<number[]>([]);

  const t = translations[language].blog;

  useEffect(() => {
    fetchPosts();
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isAdmin) {
      interval = setInterval(() => {
        fetchPosts(true); 
      }, 5000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isAdmin]);

  // Effect to handle Auto-Translation (Bidirectional)
  useEffect(() => {
    if (posts.length > 0) {
      handleAutoTranslation();
    }
  }, [language, posts]);

  // Regex to check for Bengali characters
  const containsBengali = (text: string) => /[\u0980-\u09FF]/.test(text);

  // Helper to check if a translation looks suspiciously short (Summary detection)
  const isSuspiciouslyShort = (original: string, translated?: string) => {
    if (!translated || translated.trim() === '') return true; // Missing
    // If original is substantial (>100 chars) but translation is less than 40% of length, it's likely a summary.
    if (original.length > 100 && translated.length < original.length * 0.4) return true;
    return false;
  };

  const handleAutoTranslation = async () => {
    let postsToTranslate: BlogPost[] = [];
    let targetLang: 'bn' | 'en' = 'bn';

    if (language === 'bn') {
      targetLang = 'bn';
      // Find posts needing BN translation OR having a bad summary translation
      postsToTranslate = posts.filter(p => 
        (isSuspiciouslyShort(p.excerpt, p.excerpt_bn)) && 
        !translatingIds.includes(p.id)
      );
    } else {
      targetLang = 'en';
      // Find posts needing EN translation (title is BN)
      postsToTranslate = posts.filter(p => 
        p.title && containsBengali(p.title) &&
        !translatingIds.includes(p.id)
      );
    }

    if (postsToTranslate.length > 0) {
      const newIds = postsToTranslate.map(p => p.id);
      setTranslatingIds(prev => [...prev, ...newIds]);

      for (const post of postsToTranslate) {
        try {
          const translated = await generateTranslation(post.title, post.excerpt, targetLang);
          
          if (translated) {
            setPosts(prevPosts => prevPosts.map(p => {
              if (p.id === post.id) {
                if (targetLang === 'bn') {
                  return {
                    ...p,
                    title_bn: translated.title_bn,
                    excerpt_bn: translated.excerpt_bn
                  };
                } else {
                  return {
                    ...p,
                    title: translated.title,
                    excerpt: translated.excerpt,
                    title_bn: p.title_bn || p.title,
                    excerpt_bn: p.excerpt_bn || p.excerpt
                  };
                }
              }
              return p;
            }));

            // Silent update to DB
            if (targetLang === 'bn') {
                supabase.from('posts').update({ 
                  title_bn: translated.title_bn, 
                  excerpt_bn: translated.excerpt_bn 
                }).eq('id', post.id).then(() => {});
            }
          }
        } catch (error) {
          console.error(`Failed to translate post ${post.id}`, error);
        } finally {
           setTranslatingIds(prev => prev.filter(id => id !== post.id));
        }
      }
    }
  };

  const fetchPosts = async (isBackgroundRefresh = false) => {
    try {
      if (!isBackgroundRefresh && posts.length === 0) {
        setIsLoading(true);
      }
      
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedData: BlogPost[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          title_bn: item.title_bn,
          category: item.category,
          excerpt: item.excerpt, 
          excerpt_bn: item.excerpt_bn,
          date: item.date || new Date(item.created_at).toLocaleDateString(),
          image_url: item.image_url
        }));
        setPosts(formattedData);
        setUsingDemoData(false);
      } else {
        setPosts(DEMO_POSTS);
        setUsingDemoData(true);
      }
    } catch (err: any) {
      console.warn('Supabase fetch failed:', err.message);
      setPosts((prev) => prev.length > 0 ? prev : DEMO_POSTS);
      setUsingDemoData(true);
    } finally {
      setIsLoading(false);
    }
  };

  const displayedPosts = isFullView ? posts : posts.slice(0, 3);

  const BlogSkeleton = () => (
    <div className="bg-slate-50 rounded-3xl p-4 border border-slate-100 h-full flex flex-col">
      <div className="h-48 bg-slate-200 rounded-2xl mb-5 animate-pulse"></div>
      <div className="px-2 pb-2 flex flex-col flex-1">
        <div className="flex gap-2 mb-3">
          <div className="h-4 w-20 bg-slate-200 rounded-full animate-pulse"></div>
          <div className="h-4 w-24 bg-slate-200 rounded-full animate-pulse"></div>
        </div>
        <div className="h-6 w-3/4 bg-slate-200 rounded-lg mb-3 animate-pulse"></div>
        <div className="h-6 w-1/2 bg-slate-200 rounded-lg mb-4 animate-pulse"></div>
        
        <div className="space-y-2 mb-6">
          <div className="h-3 w-full bg-slate-200 rounded animate-pulse"></div>
          <div className="h-3 w-full bg-slate-200 rounded animate-pulse"></div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-slate-100">
           <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  return (
    <section id="blog" className={`py-12 relative z-10 ${isFullView ? 'min-h-screen pt-10' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {isFullView && (
          <nav className="mb-8 flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-bold transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200"
            >
              <ArrowLeft size={20} /> {t.back_home}
            </button>
            
            <div className="flex items-center gap-4">
              {onToggleLanguage && (
                <button 
                  onClick={onToggleLanguage}
                  className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors border border-slate-200"
                >
                  <Globe size={14} className="text-slate-600" />
                  <span className={language === 'en' ? 'text-indigo-600' : 'text-slate-500'}>EN</span>
                  <span className="text-slate-300">|</span>
                  <span className={language === 'bn' ? 'text-indigo-600' : 'text-slate-500'}>BN</span>
                </button>
              )}
              <h1 className="text-xl font-black text-slate-900 uppercase tracking-widest">{t.archive_title}</h1>
            </div>
          </nav>
        )}

        <div className={`bg-white rounded-[40px] p-8 md:p-16 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden ${isFullView ? 'min-h-[80vh]' : ''}`}>
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                 <Sparkles className="text-indigo-500" size={18} />
                 <span className="text-indigo-600 font-bold tracking-widest text-xs uppercase font-mono">
                   {isFullView ? t.all_articles : t.knowledge_hub}
                 </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                {isFullView ? t.complete_archive : t.latest_insights}
              </h2>
            </div>
            
            {!isFullView && posts.length > 3 && (
              <div className="hidden md:block">
                 <button 
                   onClick={onViewAll} 
                   className="text-slate-500 hover:text-indigo-600 font-bold text-sm transition-colors flex items-center gap-2 group"
                 >
                   {t.view_all} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                 </button>
              </div>
            )}
          </div>

          {!isLoading && usingDemoData && (
             <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3 text-blue-700 text-sm animate-fade-in-up">
                <AlertCircle size={20} />
                <span><strong>{t.demo_badge}:</strong> {t.demo_mode}</span>
             </div>
          )}

          <div className="grid md:grid-cols-3 gap-8">
            {isLoading ? (
              <>
                <BlogSkeleton />
                <BlogSkeleton />
                <BlogSkeleton />
              </>
            ) : displayedPosts.length > 0 ? (
              displayedPosts.map((post) => {
                const isTranslating = translatingIds.includes(post.id);
                const hasBengali = post.title_bn && post.title_bn.trim() !== '';
                const showBengali = language === 'bn' && hasBengali;
                
                const displayTitle = showBengali ? post.title_bn : post.title;
                const displayExcerpt = showBengali ? post.excerpt_bn : post.excerpt;

                return (
                  <div 
                    key={post.id} 
                    onClick={() => onPostClick(post)}
                    className="group flex flex-col h-full cursor-pointer bg-slate-50 rounded-3xl p-4 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 border border-slate-100 hover:border-indigo-100 animate-fade-in-up"
                  >
                    <div className="h-48 bg-white rounded-2xl overflow-hidden mb-5 relative border border-slate-100">
                      {post.image_url ? (
                        <img src={post.image_url} alt={displayTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">
                          <ImageIcon size={32} />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/95 backdrop-blur-md text-indigo-900 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-sm border border-slate-100">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col flex-grow px-2 pb-2">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                          <Calendar size={12} />
                          {post.date}
                        </div>
                        
                        {isTranslating && (
                           <div className="flex items-center gap-1 text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full animate-pulse">
                              <Loader2 size={10} className="animate-spin" />
                              {language === 'bn' ? 'Translating to BN...' : 'Translating to EN...'}
                           </div>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">
                        {displayTitle}
                      </h3>
                      
                      <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-grow line-clamp-2">
                        {displayExcerpt}
                      </p>

                      <div className="mt-auto pt-4 border-t border-slate-200/50">
                        <span className="inline-flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">
                            {t.read_story} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-3 text-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold mb-2">{t.no_content}</p>
                <p className="text-slate-500 text-sm">{t.no_content_sub}</p>
              </div>
            )}
          </div>
          
          {!isFullView && posts.length > 3 && (
            <div className="mt-8 md:hidden text-center">
               <button 
                 onClick={onViewAll} 
                 className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold shadow-sm hover:text-indigo-600 transition-colors"
               >
                 {t.view_all} <ArrowRight size={16} />
               </button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};