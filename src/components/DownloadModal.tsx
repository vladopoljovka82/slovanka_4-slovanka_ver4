import React from 'react';
import { X, Download, FileCode, Image, CheckCircle, ExternalLink, HardDrive } from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#fbf9f5] max-w-lg w-full p-8 relative border border-[#bda068]/50 shadow-2xl rounded-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#767269] hover:text-[#1e1c18] transition-colors p-1"
          aria-label="Zatvori"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-[10px] uppercase tracking-luxury text-[#bda068] font-semibold">
          Paket za Preuzimanje
        </span>
        <h3 className="font-serif text-2xl uppercase mt-1 mb-2 text-[#1e1c18]">
          Preuzmite Ceo Sajt u Jednom Folderu
        </h3>
        <p className="text-xs text-[#767269] mb-6">
          Sve je pripremljeno tačno kako ste tražili — HTML index stranica i sve slike u jednom paketu!
        </p>

        {/* Contents List */}
        <div className="bg-[#f4f0e8] p-4 rounded-sm border border-[#e5dfd5] mb-6 text-xs text-stone-700 space-y-2.5">
          <div className="font-semibold uppercase tracking-wider text-[11px] text-[#484436] flex items-center space-x-1.5 pb-1 border-b border-stone-300">
            <HardDrive className="w-4 h-4 text-[#bda068]" />
            <span>Sadržaj ZIP foldera (12.5 MB):</span>
          </div>

          <div className="flex items-center space-x-2">
            <FileCode className="w-4 h-4 text-[#bda068] shrink-0" />
            <span>
              <strong className="font-semibold text-[#1e1c18]">index.html</strong> — Samostalna veb stranica sa stilovima, fontovima, jelovnikom i administratorskim panelom
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Image className="w-4 h-4 text-[#bda068] shrink-0" />
            <span>
              <strong className="font-semibold text-[#1e1c18]">slika1.jpg do slika10.jpg &amp; koktel1.jpg do koktel4.jpg</strong> — Svih 14 fotografija lokala, terase, hrane i koktela
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong className="font-semibold text-[#1e1c18]">UPUTSTVO.txt</strong> — Kratko objašnjenje za otvaranje i postavljanje
            </span>
          </div>
        </div>

        {/* How to use */}
        <div className="mb-6 space-y-1 text-xs text-stone-600">
          <p className="font-medium text-[#1e1c18]">Kako da koristite:</p>
          <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px]">
            <li>Preuzmite ZIP klikom na dugme ispod.</li>
            <li>Raspakujte (Extract) folder bilo gde na računaru.</li>
            <li>Dvokliknite na <strong className="text-[#1e1c18]">index.html</strong> — sajt se odmah otvara u vašem browseru sa svim slikama!</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <a
            href="./slovanka-caffe-pizzeria.zip"
            download="slovanka-caffe-pizzeria.zip"
            className="w-full py-3.5 bg-[#1e1c18] text-white hover:bg-[#484436] transition-all text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 rounded-sm shadow-sm"
          >
            <Download className="w-4 h-4 text-[#bda068]" />
            <span>Preuzmi Slovanka ZIP Paket (8.4 MB)</span>
          </a>

          <a
            href="./standalone.html"
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 bg-transparent border border-[#1e1c18] text-[#1e1c18] hover:bg-[#f4f0e8] transition-all text-xs uppercase tracking-widest font-medium flex items-center justify-center space-x-2 rounded-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Otvori Samostalni index.html u Novom Tabu</span>
          </a>
        </div>
      </div>
    </div>
  );
};
