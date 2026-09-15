import React from 'react';
import { Utensils, Star, Download, ChevronRight } from 'lucide-react';
import { useSiteContent } from '../utils/useSiteContent';
import { HeroAnimation } from './HeroAnimation';

interface HeroProps {
  onOpenReservation: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenReservation }) => {
  const content = useSiteContent();
  const { hero } = content;

  return (
    <section className="relative min-h-[92vh] pt-32 pb-20 flex items-center justify-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Block */}
          <div className="lg:col-span-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-3 mb-6">
              <span className="h-px w-8 bg-[#bda068]" />
              <span className="text-xs uppercase tracking-luxury text-[#bda068] font-semibold">
                {hero.eyebrow}
              </span>
              <span className="h-px w-8 bg-[#bda068]" />
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light italic leading-[1.08] mb-6 text-[#1e1c18]">
              {hero.title}
            </h1>

            <p className="text-[#767269] max-w-lg font-light text-sm sm:text-base leading-relaxed mb-8 mx-auto lg:mx-0">
              {hero.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <a
                href="#meni"
                className="w-full sm:w-auto px-7 py-3.5 bg-[#1e1c18] text-white text-xs uppercase tracking-widest hover:bg-[#484436] transition-all text-center font-medium shadow-xs"
              >
                {hero.btnMenu || 'Istražite Jelovnik'}
              </a>
              <button
                onClick={onOpenReservation}
                className="w-full sm:w-auto px-7 py-3.5 border border-[#1e1c18] text-[#1e1c18] text-xs uppercase tracking-widest hover:bg-[#f4f0e8] transition-all font-medium"
              >
                {hero.btnComment || 'Ostavite Komentar'}
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="mt-12 pt-8 border-t border-[#e5dfd5] flex flex-wrap items-center justify-center lg:justify-start gap-8 text-[#767269]">
              <div className="flex items-center space-x-2">
                <Utensils className="w-4 h-4 text-[#bda068]" />
                <span className="text-[11px] uppercase tracking-wider">{hero.badge1 || 'Originalna Receptura'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-[#bda068]" />
                <span className="text-[11px] uppercase tracking-wider">{hero.badge2 || 'Vrhunska Ocena Gostiju'}</span>
              </div>
            </div>
          </div>

          {/* Right Hero Animated Showcase */}
          <div className="lg:col-span-6">
            <HeroAnimation />
          </div>
        </div>
      </div>
    </section>
  );
};
