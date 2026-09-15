import React from 'react';
import { Download, ShieldCheck } from 'lucide-react';
import { useSiteContent } from '../utils/useSiteContent';

interface FooterProps {
  onDownloadZip: () => void;
  onOpenAdminModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onDownloadZip, onOpenAdminModal }) => {
  const currentYear = new Date().getFullYear();
  const content = useSiteContent();
  const { footer } = content;

  return (
    <footer className="border-t border-[#e5dfd5] bg-[#fbf9f5] py-14 px-6 text-center">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <span className="font-serif text-2xl md:text-3xl tracking-luxury font-semibold uppercase text-[#1e1c18]">
          {footer.title || 'SLOVANKA'}
        </span>
        <span className="text-[9px] uppercase tracking-luxury text-[#bda068] font-medium mt-1">
          {footer.subtitle || 'CAFFE PIZZERIA'}
        </span>
        <div className="w-12 h-px bg-[#bda068] my-4" />
        
        <p className="text-xs text-[#767269] font-light max-w-md mb-6">
          {footer.aboutText}
        </p>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-xs uppercase tracking-widest text-[#767269] mb-8 font-medium">
          <a href="#o-nama" className="hover:text-[#bda068] transition-colors">O Nama</a>
          <a href="#meni" className="hover:text-[#bda068] transition-colors">Jelovnik</a>
          <a href="#ambijent" className="hover:text-[#bda068] transition-colors">Ambijent</a>
          <a href="#kokteli" className="hover:text-[#bda068] transition-colors">Kokteli</a>
          <a href="#kontakt" className="hover:text-[#bda068] transition-colors">Kontakt & Komentari</a>
          {onOpenAdminModal && (
            <button
              onClick={onOpenAdminModal}
              className="hover:text-[#bda068] transition-colors inline-flex items-center space-x-1.5 text-stone-500"
              title="Administracija sajta (Komentari, Meni, Tekstovi)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#bda068]" />
              <span>Moderacija</span>
            </button>
          )}
          <button
            onClick={onDownloadZip}
            className="hover:text-[#bda068] transition-colors inline-flex items-center space-x-1.5 text-[#1e1c18] font-semibold underline underline-offset-4 decoration-[#bda068]"
            title="Preuzmite kompletan sajt u ZIP folderu"
          >
            <Download className="w-3.5 h-3.5 text-[#bda068]" />
            <span>{footer.downloadText || 'Preuzmi sajt'}</span>
          </button>
        </div>

        <p className="text-[11px] text-stone-400 uppercase tracking-wider">
          {footer.copyright}
        </p>
      </div>
    </footer>
  );
};


