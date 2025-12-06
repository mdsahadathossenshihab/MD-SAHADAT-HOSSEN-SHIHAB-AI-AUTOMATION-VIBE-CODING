import React from 'react';
import { Code2, Bot, MessageSquare, Workflow, Zap, Layers } from 'lucide-react';
import { Service } from '../types';

const services: Service[] = [
  {
    title: "Vibe Coding",
    description: "Rapid, AI-assisted development. I build fast, sleek web apps using Cursor, React & Tailwind.",
    icon: Code2
  },
  {
    title: "n8n Automation",
    description: "Complex business logic automation. Connect Supabase, Stripe, Gmail without writing boilerplate.",
    icon: Workflow
  },
  {
    title: "AI Chatbots",
    description: "Custom knowledge-base chatbots trained on your data to handle support 24/7.",
    icon: MessageSquare
  },
  {
    title: "Autonomous Agents",
    description: "Self-operating AI agents that can browse the web, scrape data, and perform actions.",
    icon: Bot
  }
];

export const Services: React.FC = () => {
  return (
    <section id="services" className="py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Container with rounded corners and margins */}
        <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-xl shadow-slate-200/50 border border-slate-100">
          
          <div className="text-center mb-16">
            <span className="text-indigo-600 font-bold tracking-widest text-xs uppercase bg-indigo-50 px-4 py-2 rounded-full mb-6 inline-block">
              Expertise
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Solutions that <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Scale</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
              I combine visual automation with custom code to deliver robust systems faster than traditional agencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="group relative bg-slate-50 p-8 md:p-10 rounded-3xl border border-slate-100 hover:bg-white hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
              >
                
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 text-slate-700 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm border border-slate-100 group-hover:scale-110">
                  <service.icon size={32} strokeWidth={1.5} />
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  {service.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-slate-400 group-hover:text-indigo-500 transition-colors">
                  <span>Learn more</span>
                  <Zap size={14} className="group-hover:fill-indigo-500" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};