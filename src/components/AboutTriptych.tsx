import React from 'react';
import { useSiteContent } from '../utils/useSiteContent';

export const AboutTriptych: React.FC = () => {
  const content = useSiteContent();
  const { about } = content;

  return (
    <section id="o-nama" className="py-20 border-y border-[#e5dfd5] bg-[#f4f0e8]/60">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-luxury text-[#bda068] font-semibold">
            {about.eyebrow}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl mt-2 mb-3 font-light text-[#1e1c18]">
            {about.title}
          </h2>
          <div className="w-12 h-px bg-[#bda068] mx-auto mb-4" />
          <p className="text-[#767269] text-sm leading-relaxed font-light">
            {about.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Letnja Terasa */}
          <div className="group overflow-hidden relative aspect-[4/3] bg-stone-200 rounded-sm shadow-sm">
            <img
              src="./slika5.jpg"
              alt="Letnja terasa Slovanka"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent transition-colors" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[10px] uppercase tracking-widest text-[#bda068] font-semibold">
                {about.card1Badge}
              </span>
              <p className="font-serif text-lg font-light">{about.card1Title}</p>
            </div>
          </div>

          {/* Card 2: Restoranska Sala */}
          <div className="group overflow-hidden relative aspect-[4/3] bg-stone-200 rounded-sm shadow-sm">
            <img
              src="./slika6.jpg"
              alt="Glavna sala restorana Slovanka"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent transition-colors" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[10px] uppercase tracking-widest text-[#bda068] font-semibold">
                {about.card2Badge}
              </span>
              <p className="font-serif text-lg font-light">{about.card2Title}</p>
            </div>
          </div>

          {/* Card 3: Espreso Kafa */}
          <div className="group overflow-hidden relative aspect-[4/3] bg-stone-200 rounded-sm shadow-sm">
            <img
              src="./slika4.jpg"
              alt="Kafa i brendirana salveta"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent transition-colors" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[10px] uppercase tracking-widest text-[#bda068] font-semibold">
                {about.card3Badge}
              </span>
              <p className="font-serif text-lg font-light">{about.card3Title}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
