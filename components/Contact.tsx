import React from 'react';
import { Linkedin, Facebook, Twitter, Mail } from 'lucide-react';
import { ContactProps } from '../types';
import { translations } from '../utils/translations';

export const Contact: React.FC<ContactProps> = ({ language }) => {
  const t = translations[language].contact;

  return (
    <footer id="contact" className="py-12 relative z-10 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        
        <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{t.title}</h2>
            <p className="text-slate-500 text-sm">{t.subtitle}</p>
        </div>

        <div className="flex gap-6 mb-12">
           {/* LinkedIn */}
           <a 
             href="https://www.linkedin.com/in/md-sahadat-hossen-shihab/" 
             target="_blank" 
             rel="noopener noreferrer"
             className="group relative p-4 bg-slate-50 rounded-2xl hover:bg-[#0077b5] transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-lg hover:shadow-blue-200"
             aria-label="LinkedIn"
           >
             <Linkedin size={24} className="text-slate-600 group-hover:text-white transition-colors" />
           </a>

           {/* Facebook */}
           <a 
             href="https://www.facebook.com/MDSAHADATHOSSENSHIHAB" 
             target="_blank" 
             rel="noopener noreferrer"
             className="group relative p-4 bg-slate-50 rounded-2xl hover:bg-[#1877f2] transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-lg hover:shadow-blue-200"
             aria-label="Facebook"
           >
             <Facebook size={24} className="text-slate-600 group-hover:text-white transition-colors" />
           </a>

           {/* X / Twitter */}
           <a 
             href="https://x.com/SHOSSENSHIHAB" 
             target="_blank" 
             rel="noopener noreferrer"
             className="group relative p-4 bg-slate-50 rounded-2xl hover:bg-black transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-lg hover:shadow-slate-200"
             aria-label="X (Twitter)"
           >
             <Twitter size={24} className="text-slate-600 group-hover:text-white transition-colors" />
           </a>
        </div>

        <div className="w-full max-w-xs h-px bg-slate-100 mb-8"></div>

        <div className="text-center">
          <p className="text-slate-400 text-xs font-medium tracking-widest uppercase">
            © {new Date().getFullYear()} MD SAHADAT HOSSEN SHIHAB. {t.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};
