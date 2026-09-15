import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutTriptych } from './components/AboutTriptych';
import { MenuSection } from './components/MenuSection';
import { OliveFeatureSection } from './components/OliveFeatureSection';
import { GallerySection } from './components/GallerySection';
import { CocktailsSection } from './components/CocktailsSection';
import { ContactAndReservation } from './components/ContactAndReservation';
import { Footer } from './components/Footer';
import { ReservationModal } from './components/ReservationModal';
import { DownloadModal } from './components/DownloadModal';
import { AdminCommentsModal } from './components/AdminCommentsModal';

export default function App() {
  const [reservationOpen, setReservationOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [adminCommentsOpen, setAdminCommentsOpen] = useState(false);

  useEffect(() => {
    // If URL has ?admin or ?moderacija, open admin comments modal automatically
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.has('admin') || params.has('moderacija')) {
        setAdminCommentsOpen(true);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#1e1c18] font-sans antialiased selection:bg-[#bda068] selection:text-white">
      {/* Top Navigation */}
      <Header onOpenAdminModal={() => setAdminCommentsOpen(true)} />

      {/* Main Content */}
      <main>
        <Hero onOpenReservation={() => setReservationOpen(true)} />
        <AboutTriptych />
        <MenuSection />
        <OliveFeatureSection />
        <GallerySection />
        <CocktailsSection />
        <ContactAndReservation onOpenAdminModal={() => setAdminCommentsOpen(true)} />
      </main>

      {/* Footer */}
      <Footer
        onDownloadZip={() => setDownloadOpen(true)}
        onOpenAdminModal={() => setAdminCommentsOpen(true)}
      />

      {/* Modals */}
      <ReservationModal
        isOpen={reservationOpen}
        onClose={() => setReservationOpen(false)}
      />
      <DownloadModal
        isOpen={downloadOpen}
        onClose={() => setDownloadOpen(false)}
      />
      <AdminCommentsModal
        isOpen={adminCommentsOpen}
        onClose={() => setAdminCommentsOpen(false)}
      />
    </div>
  );
}
