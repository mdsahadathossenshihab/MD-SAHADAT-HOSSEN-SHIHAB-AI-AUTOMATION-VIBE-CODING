import React, { useState, useEffect } from 'react';
import { X, LayoutDashboard, FileText, Settings, LogOut, Plus, Trash2, Search, AlertTriangle, Database, RefreshCw, ChevronRight, Pencil, Upload, Image as ImageIcon, Workflow, Copy, Terminal, ArrowRight, CloudOff } from 'lucide-react';
import { AdminDashboardProps, BlogPost } from '../types';
import { supabase, DEMO_POSTS } from '../services/supabaseClient';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'automation' | 'settings'>('overview');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  
  // Post State (Create/Edit)
  const [editingId, setEditingId] = useState<number | null>(null);
  const [postForm, setPostForm] = useState({ title: '', category: '', excerpt: '', image_url: '' });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Error Handling
  const [rlsError, setRlsError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchPosts();
    }
  }, [isOpen]);

  const fetchPosts = async () => {
    setIsLoading(true);
    setConnectionError(false);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedData: BlogPost[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          excerpt: item.excerpt,
          date: item.date || new Date(item.created_at).toLocaleDateString(),
          image_url: item.image_url
        }));
        setPosts(formattedData);
      } else {
        // Fallback or empty state
         if (!data || data.length === 0) {
           // We can show empty, or show demo posts if we want admin to see them too.
           // For admin, usually showing 'No Posts' is better if DB is truly empty, 
           // but if connection fails, we show demo.
           setPosts([]); 
         }
      }
    } catch (err: any) {
      console.error('Error fetching posts in Admin:', err.message);
      setConnectionError(true);
      // Show demo posts in admin so it's not empty during error
      setPosts(DEMO_POSTS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    if (connectionError) {
      alert("Cannot create posts while database is offline (Demo Mode).");
      return;
    }
    setEditingId(null);
    setPostForm({ title: '', category: '', excerpt: '', image_url: '' });
    setSelectedImage(null);
    setImagePreview(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    if (connectionError) {
       alert("Cannot edit demo posts.");
       return;
    }
    setEditingId(post.id);
    setPostForm({
      title: post.title,
      category: post.category,
      excerpt: post.excerpt,
      image_url: post.image_url || ''
    });
    setImagePreview(post.image_url || null);
    setSelectedImage(null);
    setShowAddModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('blog-images').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error.message);
      alert('Image upload failed: ' + error.message);
      return null;
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (connectionError) return;
    if (!postForm.title || !postForm.excerpt) return;
    
    setIsSubmitting(true);
    setRlsError(null);
    const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    try {
      let finalImageUrl = postForm.image_url;

      // Upload image if selected
      if (selectedImage) {
        const uploadedUrl = await uploadImage(selectedImage);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        } else {
          setIsSubmitting(false);
          return; // Stop if upload failed
        }
      }

      let error;
      
      if (editingId) {
        // UPDATE Existing Post
        const { error: updateError } = await supabase
          .from('posts')
          .update({ 
            title: postForm.title, 
            category: postForm.category || 'General', 
            excerpt: postForm.excerpt,
            image_url: finalImageUrl
          })
          .eq('id', editingId);
        error = updateError;
      } else {
        // INSERT New Post
        const { error: insertError } = await supabase
          .from('posts')
          .insert([{ 
              title: postForm.title, 
              category: postForm.category || 'General', 
              excerpt: postForm.excerpt,
              date: currentDate,
              image_url: finalImageUrl
            }]);
        error = insertError;
      }

      if (error) throw error;
      
      setShowAddModal(false);
      setPostForm({ title: '', category: '', excerpt: '', image_url: '' });
      setSelectedImage(null);
      setImagePreview(null);
      setEditingId(null);
      fetchPosts();
      alert(editingId ? "Post updated successfully!" : "Post created successfully!");
    } catch (err: any) {
      console.error("Save Error:", err.message);
      if (err.message.includes('policy') || err.message.includes('row-level security')) {
        setRlsError("RLS_BLOCK");
      } else {
        alert("Error: " + err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (id: number) => {
    if (connectionError) {
      alert("Cannot delete demo posts.");
      return;
    }
    if (!window.confirm("Delete this post permanently?")) return;
    
    setRlsError(null);
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
      
      setPosts(posts.filter(p => p.id !== id));
    } catch (err: any) {
      console.error("Delete Error:", err.message);
      if (err.message.includes('policy') || err.message.includes('row-level security')) {
        setRlsError("RLS_BLOCK");
      } else {
        alert("Failed to delete: " + err.message);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-100 text-slate-900 flex animate-in slide-in-from-bottom-10 duration-300">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-black tracking-widest flex items-center gap-2">
             <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">S</div>
             SAS ADMIN
          </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard size={20} /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('posts')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'posts' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FileText size={20} /> Posts
          </button>
           <button 
            onClick={() => setActiveTab('automation')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'automation' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Workflow size={20} /> API & Automation
          </button>
          <button 
             onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Settings size={20} /> Settings
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-xl transition-colors">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 relative">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center md:justify-end">
          <div className="md:hidden font-black text-slate-900">SAS ADMIN</div>
          <button onClick={onClose} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium px-4 py-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={18} /> Close Panel
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          
          {/* Connection Error Banner */}
          {connectionError && (
             <div className="mb-8 bg-orange-50 border border-orange-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
               <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                 <CloudOff size={24} />
               </div>
               <div>
                  <h3 className="text-orange-900 font-bold text-sm">Database Connection Failed</h3>
                  <p className="text-orange-700 text-xs">Viewing in Demo Mode. Connect a valid Supabase project to enable editing.</p>
               </div>
             </div>
          )}

          {/* RLS ERROR BANNER */}
          {rlsError === "RLS_BLOCK" && (
            <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                  <AlertTriangle size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-red-900 font-bold text-lg mb-1">Permission Denied (RLS Policy)</h3>
                  <p className="text-red-700 text-sm mb-4">Supabase blocked this action. You need to enable policies for 'UPDATE', 'DELETE' or 'INSERT'.</p>
                  
                  <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                    <code className="text-green-400 text-xs font-mono">
                      -- Fix Permissions in Supabase SQL Editor:<br/>
                      create policy "Enable all for anon" on posts for all to anon using (true) with check (true);
                    </code>
                  </div>
                  <button onClick={() => setRlsError(null)} className="mt-4 text-xs font-bold text-red-600 hover:underline">Dismiss</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                      <FileText size={24} />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Total Posts</span>
                  </div>
                  <div className="text-4xl font-black text-slate-900">{posts.length}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                      <Database size={24} />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Database Status</span>
                  </div>
                  <div className={`text-xl font-bold flex items-center gap-2 ${connectionError ? 'text-red-600' : 'text-green-600'}`}>
                    {connectionError ? 'Offline' : 'Online'} 
                    <div className={`w-2 h-2 rounded-full ${connectionError ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900">Manage Posts</h1>
                <button 
                  onClick={handleOpenCreate}
                  disabled={connectionError}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-slate-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={18} /> New Post
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Image</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Title</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Category</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {isLoading ? (
                        <tr><td colSpan={5} className="p-8 text-center text-slate-400">Loading posts...</td></tr>
                      ) : posts.length === 0 ? (
                        <tr><td colSpan={5} className="p-8 text-center text-slate-400">No posts found.</td></tr>
                      ) : (
                        posts.map(post => (
                          <tr key={post.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="p-4">
                              <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                                {post.image_url ? (
                                  <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <ImageIcon size={20} className="text-slate-300" />
                                )}
                              </div>
                            </td>
                            <td className="p-4 font-bold text-slate-900">{post.title}</td>
                            <td className="p-4">
                              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-bold">{post.category}</span>
                            </td>
                            <td className="p-4 text-slate-500 text-sm">{post.date}</td>
                            <td className="p-4 text-right flex justify-end gap-2">
                              <button 
                                onClick={() => handleOpenEdit(post)}
                                disabled={connectionError}
                                className="text-slate-300 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-30"
                                title="Edit Post"
                              >
                                <Pencil size={18} />
                              </button>
                              <button 
                                onClick={() => handleDeletePost(post.id)}
                                disabled={connectionError}
                                className="text-slate-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30"
                                title="Delete Post"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'automation' && (
            <div className="space-y-8">
              <div className="border-b border-slate-200 pb-4">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">n8n Automation Setup</h1>
                <p className="text-slate-600">
                  Follow these 2 steps to connect your AI Agent (n8n) to your website database.
                </p>
              </div>

              {/* Step 1: Create Database Table */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Database size={100} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
                     <h3 className="text-xl font-bold text-slate-900">Create Table in Supabase</h3>
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-4">
                    Copy the code below, go to your Supabase <b>SQL Editor</b>, paste it, and click <b>RUN</b>. This creates the 'posts' table with the correct columns.
                  </p>

                  <div className="bg-slate-900 text-slate-300 p-4 rounded-xl text-xs font-mono relative group">
                    <button 
                       onClick={() => copyToClipboard(`
create table if not exists posts (
  id bigint primary key generated always as identity,
  title text not null,
  excerpt text not null,
  category text default 'General',
  image_url text,
  date text default to_char(now(), 'Mon DD, YYYY'),
  created_at timestamptz default now()
);

-- Enable public access
alter table posts enable row level security;
create policy "Public Read" on posts for select using (true);
create policy "Public Insert" on posts for insert with check (true);
create policy "Public Update" on posts for update using (true);
create policy "Public Delete" on posts for delete using (true);
`)}
                       className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2"
                    >
                      <Copy size={14} /> Copy SQL
                    </button>
                    <pre className="whitespace-pre-wrap">
{`create table if not exists posts (
  id bigint primary key generated always as identity,
  title text not null,
  excerpt text not null,
  category text default 'General',
  image_url text,
  date text default to_char(now(), 'Mon DD, YYYY'),
  created_at timestamptz default now()
);

-- Enable public access (Allows n8n to write)
alter table posts enable row level security;
create policy "Public Read" on posts for select using (true);
create policy "Public Insert" on posts for insert with check (true);
create policy "Public Update" on posts for update using (true);
create policy "Public Delete" on posts for delete using (true);`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Step 2: Configure n8n */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Workflow size={100} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
                     <h3 className="text-xl font-bold text-slate-900">Configure n8n Node</h3>
                  </div>

                  <p className="text-slate-600 text-sm mb-6">
                    In your n8n <b>Supabase Node</b>, set the Operation to <b>Create</b> and Table to <b>posts</b>. Then map the fields like this:
                  </p>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-bold text-sm text-slate-500 uppercase mb-3">Your n8n Output Data</h4>
                      <div className="space-y-2">
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-sm font-mono">AI Generated Title</div>
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-sm font-mono">AI Generated Article Body</div>
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-sm font-mono">"Automation" (Text)</div>
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-sm font-mono">Image URL (String)</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                       <ArrowRight size={24} className="text-slate-300 hidden md:block" />
                       <ArrowRight size={24} className="text-slate-300 md:hidden rotate-90 my-2" />
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-500 uppercase mb-3">Supabase Column Name</h4>
                      <div className="space-y-2">
                        <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-800 text-sm font-mono font-bold">title</div>
                        <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-800 text-sm font-mono font-bold">excerpt</div>
                        <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-800 text-sm font-mono font-bold">category</div>
                        <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-800 text-sm font-mono font-bold">image_url</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Info */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex gap-3">
                 <AlertTriangle className="text-yellow-600 shrink-0" size={20} />
                 <div className="text-sm text-yellow-800">
                    <strong>Important:</strong> You need your Supabase URL and Service Role Key to connect n8n. You can find these in your Supabase Dashboard under <u>Settings &gt; API</u>.
                 </div>
              </div>

            </div>
          )}

          {activeTab === 'settings' && (
             <div className="space-y-6">
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <div className="bg-white p-8 rounded-2xl border border-slate-200">
                    <p className="text-slate-500">Global site settings will appear here.</p>
                </div>
             </div>
          )}
        </div>
      </main>

      {/* Add/Edit Post Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[110] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Post' : 'Create New Post'}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900"><X size={24} /></button>
            </div>
            <form onSubmit={handleSavePost} className="p-6 space-y-4">
              
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Cover Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden relative">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      id="file-upload"
                      className="hidden"
                    />
                    <label 
                      htmlFor="file-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer font-bold text-sm transition-colors"
                    >
                      <Upload size={16} /> Choose File
                    </label>
                    <p className="text-xs text-slate-400 mt-2">Recommended: 1200x600px. Max 2MB.</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                    <input 
                      required
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none font-bold text-slate-900" 
                      placeholder="e.g. The Future of Agents"
                      value={postForm.title}
                      onChange={e => setPostForm({...postForm, title: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                    <input 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none" 
                      placeholder="e.g. Automation"
                      value={postForm.category}
                      onChange={e => setPostForm({...postForm, category: e.target.value})}
                    />
                </div>
              </div>
              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Content</label>
                  <textarea 
                    required
                    className="w-full h-40 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none resize-none" 
                    placeholder="Write your article content here..."
                    value={postForm.excerpt}
                    onChange={e => setPostForm({...postForm, excerpt: e.target.value})}
                  />
              </div>
              <div className="flex justify-end pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl mr-2">Cancel</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? <RefreshCw className="animate-spin" size={18} /> : (editingId ? 'Update Post' : 'Publish Post')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};