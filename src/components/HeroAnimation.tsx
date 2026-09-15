import React, { useEffect, useRef } from 'react';

export const HeroAnimation: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Osiguraj pouzdan autoplay čak i ako pretraživač zahteva eksplicitno pokretanje
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay je spreman, nastaviće čim stranica postane aktivna
        });
      }
    }
  }, []);

  return (
    <div className="relative mx-auto max-w-md lg:max-w-none select-none pointer-events-none">
      {/* Glavni kontejner animacije / videa bez kontrola, dugmića i teksta */}
      <div className="relative overflow-hidden shadow-2xl rounded-sm aspect-[4/5] bg-[#12110e] border border-[#bda068]/30">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="./slovanka_sajt_poster.jpg"
          className="w-full h-full object-cover scale-[1.01]"
        >
          <source src="./slovanka_sajt.mp4" type="video/mp4" />
          <source src="./slovanka_sajt.webm" type="video/webm" />
          <source src="./slovnak.webm" type="video/webm" />
        </video>

        {/* Diskretan luksuzni preliv za prirodno stapanje sa dizajnom sajta */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
      </div>

      {/* Diskretni zlatni uglovi u duhu Slovanka estetike */}
      <div className="absolute -top-3 -left-3 w-16 h-16 border-t border-l border-[#bda068]/40 pointer-events-none -z-10" />
      <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b border-r border-[#bda068]/40 pointer-events-none -z-10" />
    </div>
  );
};
