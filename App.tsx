import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Experience } from './components/Experience';
import { Blog } from './components/Blog';
import { Contact } from './components/Contact';
import { GeminiChat } from './components/GeminiChat';
import { AdminDashboard } from './components/AdminDashboard';
import { SinglePost } from './components/SinglePost';
import { X, Lock, LayoutDashboard, Globe } from 'lucide-react';
import { BlogPost, Language } from './types';
import { translations } from './utils/translations';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  
  // Language State
  const [language, setLanguage] = useState<Language>('en');

  // Changed logic: Store the full post object for instant load
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  // Keep track of ID for URL handling if refreshed
  const [viewPostId, setViewPostId] = useState<string | null>(null);
  
  // State for viewing ALL posts (Archive view)
  const [viewAllPosts, setViewAllPosts] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const t = translations[language];

  // Check URL for ?post=ID on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('post');
    if (postId) {
      setViewPostId(postId);
    }

    const savedAdmin = localStorage.getItem('isAdmin');
    if (savedAdmin === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'bn' : 'en');
  };

  const handlePostClick = (post: BlogPost) => {
    // Instant load by setting the object directly
    setSelectedPost(post);
    setViewPostId(post.id.toString());
    // Update URL without reload
    window.history.pushState({}, '', `?post=${post.id}`);
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    // Clear URL parameter without refreshing
    window.history.pushState({}, '', window.location.pathname);
    setViewPostId(null);
    setSelectedPost(null);
    setViewAllPosts(false);
  };

  const handleAdminTrigger = () => {
    if (isAdmin) {
      setShowDashboard(true);
      return;
    }
    setShowLoginModal(true);
    setLoginError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPass = password.trim();

    if (normalizedEmail === 'shihabno.18@gmail.com' && normalizedPass === '@shihab122') {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      setShowLoginModal(false);
      setShowDashboard(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Check email & password.');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    setShowDashboard(false);
    alert("Logged out successfully.");
  };

  // IF VIEWING A SINGLE POST (Either via click or direct URL)
  if (viewPostId || selectedPost) {
    return (
      <SinglePost 
        postId={viewPostId || (selectedPost?.id.toString() || '')} 
        initialPost={selectedPost} // Pass the data we already have!
        onBack={handleBackToHome} 
        language={language}
        onToggleLanguage={toggleLanguage}
      />
    );
  }

  // IF VIEWING ALL POSTS (Archive Page)
  if (viewAllPosts) {
    return (
      <div className="bg-slate-50 min-h-screen">
        <Blog 
          isAdmin={isAdmin} 
          onPostClick={handlePostClick} 
          isFullView={true} 
          onBack={handleBackToHome}
          language={language}
          onToggleLanguage={toggleLanguage}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-slate-900 overflow-hidden selection:bg-cyan-200 selection:text-slate-900">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-40 px-6 py-4 flex justify-between items-center backdrop-blur-xl bg-white/80 border-b border-white/50 shadow-sm transition-all duration-300">
        <div className="flex items-center gap-4">
            {/* BRAND LOGO SHS */}
            <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-900/20 hover:scale-105 transition-transform duration-300">
               <span className="font-black text-xl tracking-tighter">SHS</span>
            </div>

            <div className="hidden md:flex flex-col justify-center">
              <span className="font-bold text-slate-900 leading-tight">MD SAHADAT HOSSEN SHIHAB</span>
              <span className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded-full w-fit mt-1 border border-indigo-100">
                {t.nav.expert_badge}
              </span>
            </div>
            
            {isAdmin && (
              <span className="hidden md:inline-flex text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200 font-bold items-center gap-1 ml-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                ADMIN
              </span>
            )}
        </div>
        
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex gap-8 text-sm font-bold text-slate-600">
            <button onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-indigo-600 transition-colors uppercase tracking-wider text-xs">
              {t.nav.profile}
            </button>
            <button onClick={() => document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-indigo-600 transition-colors uppercase tracking-wider text-xs">
              {t.nav.insights}
            </button>
          </div>

          {/* Language Toggle */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors border border-slate-200"
          >
            <Globe size={14} className="text-slate-600" />
            <span className={language === 'en' ? 'text-indigo-600' : 'text-slate-500'}>EN</span>
            <span className="text-slate-300">|</span>
            <span className={language === 'bn' ? 'text-indigo-600' : 'text-slate-500'}>BN</span>
          </button>
          
          {isAdmin && (
            <button 
              onClick={() => setShowDashboard(true)}
              className="flex items-center gap-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl transition-all shadow-lg shadow-slate-200"
            >
              <LayoutDashboard size={14} />
              {t.nav.panel}
            </button>
          )}
        </div>
      </nav>

      <main className="relative z-10 pt-24">
        <Hero language={language} />
        <Experience language={language} />
        <Blog 
          isAdmin={isAdmin} 
          onPostClick={handlePostClick} 
          isFullView={false}
          onViewAll={() => {
            setViewAllPosts(true);
            window.scrollTo(0, 0);
          }}
          language={language}
        />
        <Contact language={language} />
      </main>

      <GeminiChat onAdminTrigger={handleAdminTrigger} language={language} />

      {/* Admin Dashboard Overlay */}
      <AdminDashboard 
        isOpen={showDashboard} 
        onClose={() => setShowDashboard(false)} 
        onLogout={handleLogout} 
      />

      {/* Admin Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative animate-in zoom-in-95 duration-200 border border-slate-200">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>
            
            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                <Lock className="text-slate-700" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Admin Access</h2>
              <p className="text-slate-500 text-sm">Restricted area for Shihab</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-blue-500" required />
              </div>
              
              {loginError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-bold">{loginError}</div>}

              <button type="submit" className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-200">
                Unlock Panel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;