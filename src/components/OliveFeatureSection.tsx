import React from 'react';
import { Facebook } from 'lucide-react';
import { useSiteContent } from '../utils/useSiteContent';

export const OliveFeatureSection: React.FC = () => {
  const content = useSiteContent();
  const { specialties } = content;

  return (
    <section className="bg-[#484436] text-white py-20 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <span className="text-xs uppercase tracking-luxury text-[#bda068] font-semibold">
          {specialties.eyebrow}
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-wide mt-2 mb-4 uppercase">
          {specialties.title}
        </h2>
        <div className="w-12 h-px bg-[#bda068] mx-auto mb-6" />
        <p className="text-stone-200 text-sm md:text-base font-light leading-relaxed mb-8">
          {specialties.description}
        </p>

        {/* Facebook link */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <span className="text-xs uppercase tracking-widest text-stone-300 font-medium">
            {specialties.fbLabel || 'Pratite nas na:'}
          </span>
          <a
            href="https://www.facebook.com/slovanka.kafebar/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2.5 px-6 py-3 bg-[#fbf9f5] text-[#1e1c18] hover:bg-[#bda068] hover:text-white transition-all text-xs uppercase tracking-widest font-semibold rounded-sm shadow-sm group"
          >
            <Facebook className="w-4 h-4 text-[#1877f2] group-hover:text-white transition-colors" />
            <span>{specialties.fbText}</span>
          </a>
        </div>
      </div>

      {/* Subtle background ornamentation */}
      <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#bda068]/10 blur-2xl pointer-events-none" />
    </section>
  );
};
