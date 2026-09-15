import React, { useState } from 'react';
import { ZoomIn, X } from 'lucide-react';
import { useSiteContent } from '../utils/useSiteContent';

interface GalleryItem {
  src: string;
  title: string;
  category: string;
  span?: string;
}

export const GallerySection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const content = useSiteContent();
  const gallery = content.gallery;

  const galleryItems: GalleryItem[] = [
    {
      src: './slika7.jpg',
      title: gallery.item1Title || 'Prostrana Letnja Terasa',
      category: gallery.item1Category || 'Otvoreni Prostor',
      span: 'md:col-start-1 md:col-span-2 md:row-start-1 md:row-span-2 sm:col-span-2 min-h-[260px] md:min-h-0',
    },
    {
      src: './slika1.jpg',
      title: gallery.item2Title || 'Pica & Domaći Specijaliteti',
      category: gallery.item2Category || 'Kuhinja & Ukusi',
      span: 'md:col-start-3 md:col-span-1 md:row-start-1 md:row-span-1 sm:col-span-1 min-h-[190px] md:min-h-0',
    },
    {
      src: './slika9.jpg',
      title: gallery.item3Title || 'Retro Detalji & Cigla',
      category: gallery.item3Category || 'Enterijer Lokala',
      span: 'md:col-start-3 md:col-span-1 md:row-start-2 md:row-span-1 sm:col-span-1 min-h-[190px] md:min-h-0',
    },
    {
      src: './slika8.jpg',
      title: gallery.item4Title || 'Urednost & Gostoprimstvo',
      category: gallery.item4Category || 'Šank & Usluga',
      span: 'md:col-start-1 md:col-span-1 md:row-start-3 md:row-span-1 sm:col-span-1 min-h-[190px] md:min-h-0',
    },
    {
      src: './slika3.jpg',
      title: gallery.item5Title || 'Autentični Slovanka Detalji',
      category: gallery.item5Category || 'Dekoracija & Atmosfera',
      span: 'md:col-start-1 md:col-span-1 md:row-start-4 md:row-span-1 sm:col-span-1 min-h-[190px] md:min-h-0',
    },
    {
      src: './slika10.jpg',
      title: gallery.item6Title || 'Topli Ambijent & Rustični Tonovi',
      category: gallery.item6Category || 'Prijatna Atmosfera',
      span: 'md:col-start-2 md:col-span-2 md:row-start-3 md:row-span-2 sm:col-span-2 min-h-[260px] md:min-h-0',
    },
  ];

  return (
    <section id="ambijent" className="py-24 max-w-7xl mx-auto px-6 md:px-12">
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

      {/* Dynamic Bento Collage Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-4 md:h-[720px] lg:h-[820px] gap-4 sm:gap-5">
        {galleryItems.map((item, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedImage(item)}
            className={`group relative overflow-hidden bg-stone-200 rounded-sm cursor-pointer shadow-sm transition-all duration-300 ${
              item.span || 'aspect-[4/3]'
            }`}
          >
            <img
              src={item.src}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
              <span className="text-[10px] uppercase tracking-widest text-[#bda068] font-semibold">
                {item.category}
              </span>
              <div className="flex items-center justify-between text-white font-serif text-lg mt-0.5">
                <span>{item.title}</span>
                <ZoomIn className="w-4 h-4 text-white/80" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-[#1e1c18] p-2 rounded-sm overflow-hidden"
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
              className="max-h-[75vh] w-auto mx-auto object-contain"
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
