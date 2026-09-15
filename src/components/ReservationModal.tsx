import React, { useState } from 'react';
import { X, CheckCircle2, Star, Send } from 'lucide-react';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDone(true);
  };

  const handleClose = () => {
    setIsDone(false);
    setName('');
    setContact('');
    setComment('');
    setRating(5);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4"
      onClick={handleClose}
    >
      <div
        className="bg-[#fbf9f5] max-w-md w-full p-8 relative border border-[#e5dfd5] shadow-2xl rounded-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#767269] hover:text-[#1e1c18] transition-colors p-1"
          aria-label="Zatvori"
        >
          <X className="w-5 h-5" />
        </button>

        {isDone ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-14 h-14 text-[#bda068] mx-auto mb-3" />
            <h3 className="font-serif text-2xl text-[#1e1c18] uppercase">Komentar Poslat!</h3>
            <p className="text-xs text-[#767269] mt-2 mb-6">
              Hvala vam, <strong className="text-[#1e1c18]">{name}</strong>. Vaš utisak i ocena ({rating}/5) su uspešno zabeleženi.
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-2.5 bg-[#1e1c18] text-white text-xs uppercase tracking-widest hover:bg-[#484436]"
            >
              U redu
            </button>
          </div>
        ) : (
          <div>
            <span className="text-[10px] uppercase tracking-luxury text-[#bda068] font-semibold">
              Vaš Utisak
            </span>
            <h3 className="font-serif text-2xl uppercase mt-1 mb-5 text-[#1e1c18]">
              Ostavite Komentar
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#767269] mb-1 font-medium">
                  Ime i Prezime *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Vaše ime"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#e5dfd5] focus:outline-none focus:border-[#1e1c18]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#767269] mb-1 font-medium">
                  Telefon ili E-mail (opciono)
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="06x xxx xxxx ili email"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#e5dfd5] focus:outline-none focus:border-[#1e1c18]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#767269] mb-1.5 font-medium">
                  Ocena (1 - 5 Zvezdica)
                </label>
                <div className="flex items-center space-x-2 bg-white px-3 py-2 border border-[#e5dfd5] rounded-sm">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-0.5 text-stone-300 hover:text-[#bda068] transition-colors focus:outline-none"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= rating ? 'text-[#bda068] fill-[#bda068]' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-medium text-[#1e1c18] ml-2">
                    {rating} / 5
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#767269] mb-1 font-medium">
                  Vaš Komentar ili Sugestija *
                </label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Podelite vaš utisak sa nama..."
                  className="w-full px-3 py-2 text-xs bg-white border border-[#e5dfd5] focus:outline-none focus:border-[#1e1c18]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-2 bg-[#1e1c18] text-white text-xs uppercase tracking-widest hover:bg-[#484436] transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <Send className="w-3.5 h-3.5 text-[#bda068]" />
                <span>Pošaljite Komentar</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
