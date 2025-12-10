import React from 'react';
import { ArrowRight, Zap, Globe, Smartphone, Terminal, Sparkles, MessageSquare, Database, Linkedin, Facebook, Twitter } from 'lucide-react';
import { HeroProps } from '../types';
import { translations } from '../utils/translations';

export const Hero: React.FC<HeroProps> = ({ language }) => {
  const t = translations[language].hero;

  const handleContact = () => {
    window.location.href = "mailto:shihabno.18@gmail.com";
  };

  return (
    <section id="hero" className="min-h-[90vh] flex flex-col justify-center px-4 md:px-8 py-10 relative overflow-hidden bg-grid-pattern">
      
      {/* Soft Gradient Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Left Content */}
        <div className="animate-fade-in-up z-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 shadow-sm text-indigo-700 text-[11px] font-bold tracking-widest mb-8 uppercase font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            {t.badge}
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] mb-8 text-slate-900 font-black">
            <span className="block text-slate-400 text-4xl md:text-6xl mb-2">{t.name_prefix}</span>
            <span className="block">{t.name_middle}</span>
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 animate-shimmer bg-[length:200%_auto]">
              SHIHAB.
            </span>
          </h1>
          
          <div className="flex flex-col gap-6 mb-10">
            <div className="flex items-center gap-4">
               <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
               <p className="font-mono text-indigo-700 font-bold text-sm tracking-widest uppercase">
                 {t.role}
               </p>
            </div>
            
            <p className="text-xl text-slate-600 leading-relaxed max-w-lg font-medium">
              {t.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
            <button 
              onClick={handleContact}
              className="group relative px-8 py-4 bg-slate-900 text-white font-bold text-lg rounded-2xl overflow-hidden shadow-xl shadow-slate-300 transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center gap-3">
                {t.cta_automate}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            <a 
              href="#services"
              className="px-8 py-4 bg-white border border-slate-200 text-slate-700 font-bold text-lg rounded-2xl shadow-sm hover:bg-indigo-50 hover:border-indigo-100 hover:text-indigo-700 transition-all"
            >
              {t.cta_explore}
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.connect}</span>
             <div className="h-px w-8 bg-slate-200"></div>
             <div className="flex gap-4">
                <a 
                  href="https://www.linkedin.com/in/md-sahadat-hossen-shihab/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-400 hover:text-[#0077b5] transition-all hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={24} />
                </a>
                <a 
                  href="https://www.facebook.com/MDSAHADATHOSSENSHIHAB" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-400 hover:text-[#1877f2] transition-all hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook size={24} />
                </a>
                <a 
                  href="https://x.com/SHOSSENSHIHAB" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-400 hover:text-black transition-all hover:scale-110"
                  aria-label="X (Twitter)"
                >
                  <Twitter size={24} />
                </a>
             </div>
          </div>
        </div>

        {/* Right Content - Visual Composition */}
        <div className="relative h-[550px] w-full flex items-center justify-center lg:justify-end perspective-1000 mt-10 lg:mt-0">
           
           {/* 1. Automation Workflow Card (Glassmorphism) */}
           <div className="absolute top-4 right-0 lg:right-4 w-full md:w-[500px] bg-white border border-indigo-100 rounded-[30px] shadow-[0_20px_60px_-15px_rgba(99,102,241,0.2)] p-8 z-10 animate-[float_6s_ease-in-out_infinite]">
              
              {/* Grid Background inside card */}
              <div className="absolute inset-0 opacity-20 rounded-[30px] overflow-hidden bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]">
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.workflow_card.title}</span>
                </div>

                {/* Nodes */}
                <div className="flex items-center justify-between relative px-2">
                   {/* Line */}
                   <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-100 -z-10 rounded-full">
                      <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-indigo-300 to-transparent animate-[shimmer_2s_infinite]"></div>
                   </div>

                   {/* Node 1: Trigger */}
                   <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-lg border-2 border-emerald-400 flex items-center justify-center hover:scale-110 transition-transform">
                        <Globe className="text-emerald-500" size={24} />
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">{t.workflow_card.webhook}</span>
                   </div>

                   {/* Node 2: Agent */}
                   <div className="flex flex-col items-center gap-3 relative">
                      <div className="absolute -top-10 bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full animate-bounce shadow-lg shadow-indigo-300">
                        {t.workflow_card.processing}
                      </div>
                      <div className="w-20 h-20 bg-slate-900 rounded-2xl shadow-2xl border-4 border-indigo-500 flex items-center justify-center z-10 hover:scale-110 transition-transform">
                         <Zap className="text-yellow-400 fill-yellow-400" size={32} />
                      </div>
                      <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">{t.workflow_card.agent}</span>
                   </div>

                   {/* Node 3: Result/Client */}
                   <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg border-2 border-white flex items-center justify-center hover:scale-110 transition-transform">
                        <Database className="text-white" size={24} />
                      </div>
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">{t.workflow_card.database}</span>
                   </div>
                </div>

                {/* Output Message Bubble */}
                <div className="mt-8 bg-slate-50/80 backdrop-blur rounded-xl p-4 border border-slate-100 flex items-start gap-3 shadow-sm">
                   <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                      <Sparkles size={14} className="text-indigo-600" />
                   </div>
                   <div className="space-y-1.5 flex-1">
                      <div className="h-2 w-3/4 bg-slate-200 rounded-full"></div>
                      <div className="h-2 w-1/2 bg-slate-200 rounded-full"></div>
                   </div>
                   <div className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                     <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                     {t.workflow_card.success}
                   </div>
                </div>
              </div>
           </div>

           {/* 2. Vibe Coding Floating Window (Overlap) */}
           <div className="absolute bottom-4 left-4 lg:-left-4 w-[300px] bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden transform rotate-[-3deg] hover:rotate-0 transition-transform duration-500 z-20">
              {/* Editor Header */}
              <div className="bg-slate-800 p-3 flex items-center gap-3 border-b border-slate-700">
                <Terminal size={14} className="text-slate-400" />
                <span className="text-xs font-mono text-slate-300">Vibe_Coding.tsx</span>
                <div className="ml-auto flex gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                   <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                </div>
              </div>
              
              {/* Editor Body */}
              <div className="p-4 font-mono text-[10px] text-slate-300 leading-loose">
                 <div className="text-slate-500">// Connecting Workflow...</div>
                 <div>
                   <span className="text-purple-400">const</span> <span className="text-yellow-300">Automate</span> = () ={'>'} {'{'}
                 </div>
                 <div className="pl-4">
                    <span className="text-purple-400">await</span> <span className="text-blue-400">n8n.trigger</span>(<span className="text-green-300">'webhook'</span>);
                 </div>
                 <div className="pl-4">
                    <span className="text-purple-400">return</span> <span className="text-cyan-300">{'<Success />'}</span>;
                 </div>
                 <div>{'}'};</div>
                 
                 {/* Cursor Effect */}
                 <div className="mt-3 flex items-center gap-2 bg-indigo-500/20 p-2 rounded border border-indigo-500/30">
                    <MessageSquare size={10} className="text-indigo-400" />
                    <span className="text-indigo-300">{t.workflow_card.code_generated}</span>
                 </div>
              </div>
           </div>

        </div>

      </div>
    </section>
  );
};
