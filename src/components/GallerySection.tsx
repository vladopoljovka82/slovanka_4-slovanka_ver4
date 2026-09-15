import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, X } from 'lucide-react';
import { useSiteContent } from '../utils/useSiteContent';

interface GalleryItem {
  id: string;
  src: string;
  title: string;
  category: string;
  span?: string;
  order: number;
}

interface GalleryCardProps {
  item: GalleryItem;
  onSelect: (item: GalleryItem) => void;
  sectionVisible: boolean;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ item, onSelect, sectionVisible }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Ako je cela sekcija već u vidokrugu, otvori sa kaskadnim kašnjenjem
    if (sectionVisible) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, item.order * 130);
      return () => clearTimeout(timer);
    }

    // Individualni posmatrač dok korisnik skroluje
    if (typeof IntersectionObserver !== 'undefined' && cardRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            const delay = (item.order % 3) * 110;
            setTimeout(() => {
              setIsOpen(true);
            }, delay);
            observer.disconnect();
          }
        },
        { threshold: 0.05, rootMargin: '60px 0px 0px 0px' }
      );
      observer.observe(cardRef.current);
      return () => observer.disconnect();
    } else {
      setIsOpen(true);
    }
  }, [sectionVisible, item.order]);

  // Sigurnosni tajmer: slike su 100% garantovano vidljive
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setIsOpen(true);
    }, 1600);
    return () => clearTimeout(safetyTimer);
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={() => onSelect(item)}
      className={`group relative overflow-hidden bg-stone-200 rounded-sm cursor-pointer shadow-sm hover:shadow-xl transition-all duration-700 ease-out ${
        item.span || 'aspect-[4/3]'
      } ${
        isOpen
          ? 'opacity-100 translate-y-0 scale-100 filter-none'
          : 'opacity-0 -translate-y-8 scale-[0.97] filter blur-[2px]'
      }`}
      style={{
        transitionDelay: `${item.order * 50}ms`,
        willChange: 'transform, opacity, filter',
      }}
    >
      {/* Zlatna akcentna linija koja prati otvaranje odozgo */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#bda068] to-transparent z-20 pointer-events-none transition-all duration-700 ${
          isOpen ? 'opacity-90 group-hover:h-[3px] group-hover:via-[#e2cb95]' : 'opacity-0'
        }`}
      />

      <img
        src={item.src}
        alt={item.title}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />

      {/* Efekat prelivnog sloja sa podacima na hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 z-10">
        <span className="text-[10px] uppercase tracking-widest text-[#bda068] font-semibold">
          {item.category}
        </span>
        <div className="flex items-center justify-between text-white font-serif text-lg mt-0.5">
          <span className="drop-shadow-xs">{item.title}</span>
          <div className="p-1.5 rounded-full bg-white/15 backdrop-blur-xs text-white group-hover:bg-[#bda068] transition-colors">
            <ZoomIn className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const GallerySection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const content = useSiteContent();
  const gallery = content.gallery;

  useEffect(() => {
    if (typeof IntersectionObserver !== 'undefined' && sectionRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setSectionVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.05, rootMargin: '80px 0px 0px 0px' }
      );
      observer.observe(sectionRef.current);
      return () => observer.disconnect();
    } else {
      setSectionVisible(true);
    }
  }, []);

  // Ordered logically from top to bottom for sequential cascade
  const galleryItems: GalleryItem[] = [
    {
      id: 'gal-item-1',
      src: './slika7.jpg',
      title: gallery.item1Title || 'Prostrana Letnja Terasa',
      category: gallery.item1Category || 'Otvoreni Prostor',
      span: 'md:col-start-1 md:col-span-2 md:row-start-1 md:row-span-2 sm:col-span-2 min-h-[260px] md:min-h-0',
      order: 0, // Top tier left
    },
    {
      id: 'gal-item-2',
      src: './slika1.jpg',
      title: gallery.item2Title || 'Pica & Domaći Specijaliteti',
      category: gallery.item2Category || 'Kuhinja & Ukusi',
      span: 'md:col-start-3 md:col-span-1 md:row-start-1 md:row-span-1 sm:col-span-1 min-h-[190px] md:min-h-0',
      order: 1, // Top tier right
    },
    {
      id: 'gal-item-3',
      src: './slika9.jpg',
      title: gallery.item3Title || 'Retro Detalji & Cigla',
      category: gallery.item3Category || 'Enterijer Lokala',
      span: 'md:col-start-3 md:col-span-1 md:row-start-2 md:row-span-1 sm:col-span-1 min-h-[190px] md:min-h-0',
      order: 2, // Second tier right
    },
    {
      id: 'gal-item-4',
      src: './slika8.jpg',
      title: gallery.item4Title || 'Urednost & Gostoprimstvo',
      category: gallery.item4Category || 'Šank & Usluga',
      span: 'md:col-start-1 md:col-span-1 md:row-start-3 md:row-span-1 sm:col-span-1 min-h-[190px] md:min-h-0',
      order: 3, // Third tier left
    },
    {
      id: 'gal-item-6',
      src: './slika10.jpg',
      title: gallery.item6Title || 'Topli Ambijent & Rustični Tonovi',
      category: gallery.item6Category || 'Prijatna Atmosfera',
      span: 'md:col-start-2 md:col-span-2 md:row-start-3 md:row-span-2 sm:col-span-2 min-h-[260px] md:min-h-0',
      order: 4, // Third & Fourth tier center-right (large focal card)
    },
    {
      id: 'gal-item-5',
      src: './slika3.jpg',
      title: gallery.item5Title || 'Autentični Slovanka Detalji',
      category: gallery.item5Category || 'Dekoracija & Atmosfera',
      span: 'md:col-start-1 md:col-span-1 md:row-start-4 md:row-span-1 sm:col-span-1 min-h-[190px] md:min-h-0',
      order: 5, // Bottom tier left
    },
  ];

  return (
    <section ref={sectionRef} id="ambijent" className="py-24 max-w-7xl mx-auto px-6 md:px-12 overflow-hidden">
      <div className="text-center mb-16">
        <span className="text-xs uppercase tracking-luxury text-[#bda068] font-semibold">
          {gallery.eyebrow || 'Pogled Iznutra'}
        </span>
        <h2 className="font-serif text-4xl md:text-5xl mt-2 tracking-wide font-light text-[#1e1c18] uppercase">
          {gallery.title || 'Naš Ambijent'}
        </h2>
        <div className="w-16 h-px bg-[#bda068] mx-auto mt-4" />
        <p className="text-[#767269] text-xs uppercase tracking-widest mt-4">
          {gallery.description || 'Harmonija detalja, toplina drveta i sunčana letnja terasa'}
        </p>
      </div>

      {/* Bento Collage Grid sa otvaranjem slika jedna po jedna odozgo na dole kako skrolujete */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-4 md:h-[720px] lg:h-[820px] gap-4 sm:gap-5">
        {galleryItems.map((item) => (
          <GalleryCard
            key={item.id}
            item={item}
            onSelect={setSelectedImage}
            sectionVisible={sectionVisible}
          />
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-[#1e1c18] p-2 rounded-sm overflow-hidden border border-[#bda068]/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 text-white rounded-full hover:bg-black transition-colors"
              aria-label="Zatvori sliku"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="max-h-[75vh] w-auto mx-auto object-contain rounded-xs"
            />
            <div className="p-4 text-center bg-[#1e1c18]">
              <span className="text-[10px] uppercase tracking-widest text-[#bda068]">
                {selectedImage.category}
              </span>
              <h4 className="font-serif text-xl text-white mt-1">{selectedImage.title}</h4>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
