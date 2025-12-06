import React from 'react';
import { Award, Zap, ExternalLink, Mail, LayoutTemplate, Workflow, Bot } from 'lucide-react';

export const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Main Card Container */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Card 1: Agency Owner */}
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 flex flex-col h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 rounded-bl-[100px] -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Award size={32} />
                </div>
                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-wider font-mono">
                  Founder
                </span>
              </div>
              
              <h3 className="text-4xl font-black text-slate-900 mb-1 tracking-tight">AutoMateIQ</h3>
              <p className="text-indigo-600 font-bold mb-6 text-lg tracking-wide uppercase font-mono">AI Automation Agency</p>
              
              <p className="text-slate-600 leading-relaxed mb-10 text-lg font-medium">
                Leading the charge in autonomous business flows. We replace manual grunt work with intelligent, self-healing AI Agents and n8n workflows.
              </p>

              <div className="mt-auto">
                <a 
                  href="https://automateiq.xyz/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all group/link"
                >
                  <span className="font-bold">Visit Agency Website</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: Detailed Skill Stack */}
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col h-full relative overflow-hidden">
             <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-bl-[100px] -mr-10 -mt-10"></div>
            
            <div className="relative z-10">
              <div className="mb-8 w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Zap size={32} />
              </div>
              <h3 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Tech Stack</h3>
              
              <div className="space-y-8">
                
                {/* Automation Stack */}
                <div>
                  <div className="flex items-center gap-3 text-slate-900 font-bold mb-4 text-lg">
                    <Workflow size={20} className="text-indigo-600" />
                    <span>Automation & Agents</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['n8n', 'Google Gemini', 'OpenAI', 'Apify', 'ElevenLabs', 'MCP Server'].map(skill => (
                      <span key={skill} className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-slate-700 text-sm font-bold shadow-sm hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all cursor-default">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dev Stack */}
                <div>
                  <div className="flex items-center gap-3 text-slate-900 font-bold mb-4 text-lg">
                    <LayoutTemplate size={20} className="text-violet-600" />
                    <span>Vibe Coding & Data</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Vibe Code', 'React', 'Next.js', 'Supabase', 'Pinecone'].map(skill => (
                      <span key={skill} className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-slate-700 text-sm font-bold shadow-sm hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700 transition-all cursor-default">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Card 3: Portfolio CTA (Full Width) */}
          <div className="md:col-span-2 bg-gradient-to-r from-slate-900 to-indigo-950 p-10 md:p-12 rounded-[40px] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-indigo-900/20">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
            <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-600/30 rounded-full blur-[100px]"></div>
            
            <div className="relative z-10 text-center md:text-left">
              <h3 className="text-3xl font-bold text-white mb-2 flex flex-col md:flex-row items-center gap-3">
                <Bot className="text-cyan-400" size={32} />
                <span>Ready to automate your business?</span>
              </h3>
              <p className="text-slate-400 font-medium text-lg max-w-xl">
                I build advanced SaaS tools and Autonomous Agents. Check my portfolio or request a live demo.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full md:w-auto">
              <a 
                href="mailto:shihabno.18@gmail.com?subject=Portfolio Request"
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-900/50"
              >
                <Mail size={18} />
                Request Demo
              </a>
              <a 
                href="https://drive.google.com/drive/folders/1JNeuN5ZTU0Ai5mhU0CG7tIziampylqEf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 px-8 py-4 rounded-2xl font-bold transition-colors"
              >
                <ExternalLink size={18} />
                Certificates
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};