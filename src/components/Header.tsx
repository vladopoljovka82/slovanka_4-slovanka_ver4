import React, { useState } from 'react';
import { Menu, X, MapPin, Phone } from 'lucide-react';
import { useSiteContent } from '../utils/useSiteContent';

interface HeaderProps {
  onOpenReservation?: () => void;
  onOpenAdminModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdminModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const content = useSiteContent();
  const header = content.header;

  const phoneClean = header.phone ? header.phone.replace(/[^0-9+]/g, '') : '+38121774012';

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#fbf9f5]/95 backdrop-blur-md border-b border-[#e5dfd5]/80 transition-all duration-300 py-3 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Location & Contact Info */}
        <div className="hidden lg:flex flex-col text-[11px] text-[#767269] leading-tight text-left">
          <div className="flex items-center space-x-2 font-medium text-[#1e1c18]">
            <span className="font-bold text-[#bda068] tracking-widest uppercase">{header.locationTag}</span>
            <span className="w-1 h-1 rounded-full bg-[#bda068]" />
            <a
              href={`tel:${phoneClean}`}
              className="hover:text-[#bda068] transition-colors flex items-center space-x-1.5 font-semibold text-[#1e1c18]"
            >
              <Phone className="w-3 h-3 text-[#bda068]" />
              <span>{header.phone}</span>
            </a>
          </div>
          <div className="flex items-center space-x-1.5 text-[10px] text-[#767269] mt-0.5 tracking-normal">
            <MapPin className="w-3 h-3 text-[#bda068] shrink-0" />
            <span>{header.address}</span>
          </div>
        </div>

        {/* Logo */}
        <a href="#" className="flex flex-col items-center group">
          <span className="font-serif text-2xl md:text-3xl tracking-luxury font-semibold uppercase text-[#1e1c18] group-hover:text-[#bda068] transition-colors">
            {header.logoTitle}
          </span>
          <span className="text-[9px] uppercase tracking-luxury text-[#bda068] font-medium -mt-1">
            {header.logoSubtitle}
          </span>
        </a>

        {/* Navigation */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <nav className="hidden md:flex items-center space-x-7 text-[11px] uppercase tracking-widest font-medium text-[#1e1c18]">
            <a href="#o-nama" className="hover:text-[#bda068] transition-colors">{header.navAbout}</a>
            <a href="#meni" className="hover:text-[#bda068] transition-colors">{header.navMenu}</a>
            <a href="#ambijent" className="hover:text-[#bda068] transition-colors">{header.navAmbijent}</a>
            <a href="#kokteli" className="hover:text-[#bda068] transition-colors">{header.navCocktails}</a>
            <a href="#kontakt" className="hover:text-[#bda068] transition-colors">{header.navContact}</a>
            {onOpenAdminModal && (
              <button
                onClick={onOpenAdminModal}
                className="text-[10px] uppercase tracking-wider text-[#bda068] hover:text-[#1e1c18] border border-[#bda068]/40 hover:border-[#1e1c18] px-2.5 py-1 rounded-sm transition-colors flex items-center space-x-1"
                title="Administratorski panel za jelovnik, komentare i tekst"
              >
                <span>Admin (PIN)</span>
              </button>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#1e1c18] p-2 focus:outline-none"
            aria-label="Otvori navigaciju"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-4 pb-6 border-t border-[#e5dfd5] mt-3 flex flex-col space-y-4 text-center text-xs uppercase tracking-widest bg-[#fbf9f5]">
          <div className="py-2 px-4 bg-[#f4f0e8] mx-4 rounded-sm border border-[#e5dfd5] normal-case">
            <div className="font-bold text-xs uppercase tracking-widest text-[#bda068]">{header.locationTag}</div>
            <div className="text-[11px] text-stone-600 mt-0.5 flex items-center justify-center space-x-1">
              <MapPin className="w-3 h-3 text-[#bda068] shrink-0" />
              <span>{header.address}</span>
            </div>
            <a
              href={`tel:${phoneClean}`}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#1e1c18] hover:text-[#bda068] mt-1.5"
            >
              <Phone className="w-3 h-3 text-[#bda068]" />
              <span>{header.phone}</span>
            </a>
          </div>

          <a
            href="#o-nama"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1 hover:text-[#bda068] transition-colors"
          >
            {header.navAbout}
          </a>
          <a
            href="#meni"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1 hover:text-[#bda068] transition-colors"
          >
            {header.navMenu}
          </a>
          <a
            href="#ambijent"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1 hover:text-[#bda068] transition-colors"
          >
            {header.navAmbijent}
          </a>
          <a
            href="#kokteli"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1 hover:text-[#bda068] transition-colors"
          >
            {header.navCocktails}
          </a>
          <a
            href="#kontakt"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1 hover:text-[#bda068] transition-colors"
          >
            {header.navContact}
          </a>
          {onOpenAdminModal && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminModal();
              }}
              className="py-1 text-[#bda068] hover:text-[#1e1c18] font-semibold transition-colors"
            >
              Admin Panel (PIN 1234)
            </button>
          )}
        </div>
      )}
    </header>
  );
};
