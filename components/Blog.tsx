import React, { useState, useEffect } from 'react';
import { ArrowRight, Calendar, Image as ImageIcon, Sparkles, AlertCircle, ArrowLeft, Globe, Loader2 } from 'lucide-react';
import { BlogPost, BlogProps } from '../types';
import { supabase, DEMO_POSTS } from '../services/supabaseClient';
import { translations } from '../utils/translations';
import { generateTranslation } from '../services/geminiService';

export const Blog: React.FC<BlogProps> = ({ isAdmin, onPostClick, isFullView = false, onViewAll, onBack, language, onToggleLanguage }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  // Start loading true initially, but never set it to true again during background refreshes
  const [isLoading, setIsLoading] = useState(true);
  const [usingDemoData, setUsingDemoData] = useState(false);
  
  // Track which posts are currently being translated to avoid duplicate API calls
  const [translatingIds, setTranslatingIds] = useState<number[]>([]);

  const t = translations[language].blog;

  useEffect(() => {
    // Initial fetch
    fetchPosts();

    // Set up polling interval if admin
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isAdmin) {
      interval = setInterval(() => {
        // We call a version of fetch that purely updates data without triggering loading state
        fetchPosts(true); 
      }, 5000);
    }

    return () => { 
      if (interval) clearInterval(interval); 
    };
  }, [isAdmin]);

  // Effect to handle Auto-Translation when language is BN
  useEffect(() => {
    if (language === 'bn' && posts.length > 0) {
      handleAutoTranslation();
    }
  }, [language, posts]);

  const handleAutoTranslation = async () => {
    // Find posts that don't have Bengali title yet and aren't currently being translated
    const postsToTranslate = posts.filter(p => 
      (!p.title_bn || p.title_bn.trim() === '') && 
      !translatingIds.includes(p.id)
    );

    // If we have posts to translate, process them
    if (postsToTranslate.length > 0) {
      // Mark them as translating
      const newIds = postsToTranslate.map(p => p.id);
      setTranslatingIds(prev => [...prev, ...newIds]);

      // Process each post
      for (const post of postsToTranslate) {
        try {
          const translated = await generateTranslation(post.title, post.excerpt);
          
          if (translated) {
            // Update local state immediately
            setPosts(prevPosts => prevPosts.map(p => {
              if (p.id === post.id) {
                return {
                  ...p,
                  title_bn: translated.title_bn,
                  excerpt_bn: translated.excerpt_bn
                };
              }
              return p;
            }));

            // Optional: Try to save to DB if we have permission (Admin) or if RLS allows
            // We do this silently in the background
            supabase
              .from('posts')
              .update({ 
                title_bn: translated.title_bn, 
                excerpt_bn: translated.excerpt_bn 
              })
              .eq('id', post.id)
              .then(({ error }) => {
                 if (error) console.warn("Could not save translation to DB (likely need Admin)", error.message);
              });
          }
        } catch (error) {
          console.error(`Failed to translate post ${post.id}`, error);
        } finally {
           // Remove from translating list
           setTranslatingIds(prev => prev.filter(id => id !== post.id));
        }
      }
    }
  };

  const fetchPosts = async (isBackgroundRefresh = false) => {
    try {
      // Only show loader on the very first mount/call, not on background refreshes
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
        // If no data in DB, use demo data
        setPosts(DEMO_POSTS);
        setUsingDemoData(true);
      }
    } catch (err: any) {
      // Silent fail in console, fallback to demo
      console.warn('Supabase fetch failed:', err.message);
      // Only set demo data if we don't have posts yet
      setPosts((prev) => prev.length > 0 ? prev : DEMO_POSTS);
      setUsingDemoData(true);
    } finally {
      // Always turn off loading, but never turn it back on in this function
      setIsLoading(false);
    }
  };

  // Determine displayed posts based on view mode
  const displayedPosts = isFullView ? posts : posts.slice(0, 3);

  // Skeleton Card Component
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
          <div className="h-3 w-2/3 bg-slate-200 rounded animate-pulse"></div>
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
        
        {/* Full View Navigation */}
        {isFullView && (
          <nav className="mb-8 flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-bold transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200"
            >
              <ArrowLeft size={20} /> {t.back_home}
            </button>
            
            <div className="flex items-center gap-4">
              {/* Language Toggle in Archive View */}
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

        {/* Container */}
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
            
            {/* View All Button - Only visible on Homepage (isFullView=false) and if there are more than 3 posts */}
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

          {/* Posts Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {isLoading ? (
              // Show Skeletons
              <>
                <BlogSkeleton />
                <BlogSkeleton />
                <BlogSkeleton />
              </>
            ) : displayedPosts.length > 0 ? (
              displayedPosts.map((post) => {
                // Determine content based on language
                const isTranslating = translatingIds.includes(post.id);
                const hasBengali = post.title_bn && post.title_bn.trim() !== '';
                
                // Show Bengali if: Language is BN AND (We have Bengali OR we are currently translating to avoid flicker)
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
                        
                        {/* Translation Indicator */}
                        {language === 'bn' && !hasBengali && isTranslating && (
                           <div className="flex items-center gap-1 text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full animate-pulse">
                              <Loader2 size={10} className="animate-spin" />
                              Translating...
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
          
          {/* Mobile View All Button (Bottom) */}
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