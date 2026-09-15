import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  Send,
  Star,
  MessageSquareQuote,
  Mail,
  ShieldCheck,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { CommentData } from '../types';
import { useSiteContent } from '../utils/useSiteContent';
import {
  RECIPIENT_EMAIL,
  getApprovedComments,
  createPendingComment,
  sendCommentEmail,
  getMailtoUrl,
  checkAndProcessUrlApproval,
} from '../utils/commentsStorage';

interface ContactAndReservationProps {
  onOpenAdminModal?: () => void;
}

export const ContactAndReservation: React.FC<ContactAndReservationProps> = ({
  onOpenAdminModal,
}) => {
  const content = useSiteContent();
  const { contact } = content;

  const [formData, setFormData] = useState<CommentData>({
    fullName: '',
    contact: '',
    rating: 5,
    comment: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pendingComment, setPendingComment] = useState<CommentData | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<boolean | null>(null);
  const [urlApprovedAlert, setUrlApprovedAlert] = useState<CommentData | null>(null);

  // Reviews from storage
  const [reviews, setReviews] = useState<CommentData[]>([]);

  const loadReviews = () => {
    setReviews(getApprovedComments());
  };

  useEffect(() => {
    loadReviews();

    // Check if user came from approval link in email
    const approvalResult = checkAndProcessUrlApproval();
    if (approvalResult.approved && approvalResult.comment) {
      setUrlApprovedAlert(approvalResult.comment);
      loadReviews();
    }

    const handleStorageChange = () => {
      loadReviews();
    };
    window.addEventListener('slovanka_comments_updated', handleStorageChange);
    return () => {
      window.removeEventListener('slovanka_comments_updated', handleStorageChange);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.comment.trim()) return;

    setSubmitting(true);

    const newPending = createPendingComment({
      fullName: formData.fullName.trim(),
      contact: formData.contact?.trim() || '',
      rating: formData.rating,
      comment: formData.comment.trim(),
    });

    setPendingComment(newPending);

    // Send email to info@slovankacaffe.com
    const res = await sendCommentEmail(newPending);
    setEmailSuccess(res.success);

    setSubmitted(true);
    setSubmitting(false);
  };

  const handleReset = () => {
    setSubmitted(false);
    setPendingComment(null);
    setEmailSuccess(null);
    setFormData({
      fullName: '',
      contact: '',
      rating: 5,
      comment: '',
    });
  };

  return (
    <section id="kontakt" className="py-24 max-w-7xl mx-auto px-6 md:px-12 border-t border-[#e5dfd5]">
      {/* Banner if comment was just approved via email link */}
      {urlApprovedAlert && (
        <div className="mb-8 p-4 bg-green-50 border border-green-300 text-green-900 rounded-sm flex items-start justify-between gap-4 animate-fade-in shadow-xs">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">
                Komentar je uspešno odobren i objavljen na sajtu!
              </h4>
              <p className="text-xs text-green-800 mt-0.5">
                Utisak gosta <strong className="font-semibold">{urlApprovedAlert.fullName}</strong> ({urlApprovedAlert.rating}/5★) je sada javno vidljiv u sekciji utisaka.
              </p>
            </div>
          </div>
          <button
            onClick={() => setUrlApprovedAlert(null)}
            className="text-green-800 hover:text-green-950 text-xs font-semibold uppercase tracking-wider"
          >
            Zatvori
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info & Testimonials */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <span className="text-xs uppercase tracking-luxury text-[#bda068] font-semibold">
              {contact.eyebrow}
            </span>
            <h2 className="font-serif text-4xl font-light mt-2 mb-6 uppercase text-[#1e1c18]">
              {contact.title}
            </h2>

            <div className="space-y-6 text-sm text-[#767269]">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-[#f4f0e8] rounded-sm text-[#bda068] shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-[#1e1c18] uppercase text-xs tracking-wider">
                    Lokacija
                  </h4>
                  <p className="font-light mt-1 text-stone-600">
                    {contact.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-[#f4f0e8] rounded-sm text-[#bda068] shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-[#1e1c18] uppercase text-xs tracking-wider">
                    Radno Vreme
                  </h4>
                  <p className="font-light mt-1 text-stone-600">
                    {contact.hoursWeek}
                  </p>
                  {contact.hoursWeekend && (
                    <p className="font-light text-stone-600">
                      {contact.hoursWeekend}
                    </p>
                  )}
                  {contact.note && (
                    <p className="text-[11px] text-stone-400 mt-0.5">{contact.note}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-[#f4f0e8] rounded-sm text-[#bda068] shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-[#1e1c18] uppercase text-xs tracking-wider">
                    Telefon za Narudžbine & Informacije
                  </h4>
                  <p className="font-light mt-1 text-lg text-[#1e1c18] font-serif font-semibold">
                    <a
                      href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                      className="hover:text-[#bda068] transition-colors inline-block"
                    >
                      {contact.phone}
                    </a>
                  </p>
                  {contact.mobile && (
                    <p className="text-xs text-stone-600 mt-0.5">
                      Mob:{' '}
                      <a
                        href={`tel:${contact.mobile.replace(/[^0-9+]/g, '')}`}
                        className="hover:text-[#bda068] font-medium transition-colors"
                      >
                        {contact.mobile}
                      </a>
                    </p>
                  )}
                  {contact.email && (
                    <p className="text-xs text-stone-500 mt-0.5">
                      Email:{' '}
                      <a
                        href={`mailto:${contact.email}`}
                        className="hover:text-[#bda068] transition-colors"
                      >
                        {contact.email}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials preview */}
          <div className="p-6 bg-[#f4f0e8] border border-[#e5dfd5] rounded-sm">
            <div className="flex items-center justify-between pb-2 border-b border-[#e5dfd5] mb-4">
              <div className="flex items-center space-x-2 text-[#484436] font-medium text-xs uppercase tracking-wider">
                <MessageSquareQuote className="w-4 h-4 text-[#bda068]" />
                <span>Utisci Naših Gostiju ({reviews.length})</span>
              </div>
              <span className="text-[10px] text-stone-500 uppercase tracking-widest">
                Odobreni komentari
              </span>
            </div>

            <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
              {reviews.length === 0 ? (
                <p className="text-xs text-stone-500 italic py-2">
                  Trenutno nema objavljenih komentara.
                </p>
              ) : (
                reviews.map((rev, idx) => (
                  <div key={rev.id || idx} className="bg-white/90 p-3.5 rounded-sm border border-stone-200/80 shadow-2xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-medium text-xs text-[#1e1c18]">{rev.fullName}</span>
                      <div className="flex text-[#bda068]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#767269] italic">"{rev.comment}"</p>
                    {rev.createdAt && (
                      <span className="text-[10px] text-stone-400 block mt-1">{rev.createdAt}</span>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Moderation link for owner */}
            {onOpenAdminModal && (
              <div className="mt-4 pt-3 border-t border-[#e5dfd5] flex items-center justify-between text-[11px] text-[#767269]">
                <button
                  type="button"
                  onClick={onOpenAdminModal}
                  className="hover:text-[#bda068] flex items-center space-x-1.5 transition-colors font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#bda068]" />
                  <span>Moderacija komentara (Admin)</span>
                </button>
                <span className="text-[10px] text-stone-400">PIN: 1234</span>
              </div>
            )}
          </div>
        </div>

        {/* Comment Form */}
        <div className="lg:col-span-7 bg-[#f4f0e8] p-8 sm:p-10 border border-[#e5dfd5] rounded-sm shadow-xs">
          <span className="text-xs uppercase tracking-luxury text-[#bda068] font-semibold">
            Vaš Utisak
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-light uppercase tracking-wider mb-2 text-[#1e1c18]">
            {contact.formTitle || 'Ostavite Komentar'}
          </h3>
          <p className="text-xs text-[#767269] uppercase tracking-widest mb-6">
            {contact.formDesc || `Komentari se šalju na odobrenje (${RECIPIENT_EMAIL}) pre objave na sajtu`}
          </p>

          {submitted && pendingComment ? (
            <div className="bg-white p-6 sm:p-8 border border-[#bda068] rounded-sm text-center animate-fade-in space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#bda068] mx-auto" />
              <div>
                <h4 className="font-serif text-2xl text-[#1e1c18] mb-1">
                  Hvala vam na komentaru!
                </h4>
                <p className="text-xs text-[#767269]">
                  Poštovani <strong className="font-semibold text-[#1e1c18]">{pendingComment.fullName}</strong>, vaš komentar je uspešno zabeležen sa ocenom {pendingComment.rating}/5★.
                </p>
              </div>

              {/* Status info box */}
              <div className="p-4 bg-[#fbf9f5] border border-stone-200 rounded-sm text-left space-y-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-[#1e1c18]">
                  <Mail className="w-4 h-4 text-[#bda068]" />
                  <span>Obaveštenje za odobrenje poslato na e-mail:</span>
                </div>
                <div className="text-xs text-stone-600 bg-white p-2.5 rounded border border-stone-200 font-mono text-[#bda068] font-semibold">
                  {RECIPIENT_EMAIL}
                </div>
                <p className="text-[11px] text-[#767269] leading-relaxed">
                  Radi očuvanja kvaliteta, svaki komentar pregleda naš administrator. Čim vlasnik klikne na link za odobrenje u mejlu (ili odobri u administratorskom panelu), vaš komentar će se automatski pojaviti na sajtu!
                </p>
              </div>

              {/* Display submitted text preview */}
              <div className="p-3.5 bg-stone-50 border border-stone-200 text-xs text-stone-600 rounded-sm text-left italic">
                "{pendingComment.comment}"
              </div>

              {/* Fallback direct email client button */}
              <div className="pt-2">
                <a
                  href={getMailtoUrl(pendingComment)}
                  className="inline-flex items-center space-x-1.5 text-xs text-stone-500 hover:text-[#bda068] transition-colors underline decoration-dotted"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Otvorite e-mail klijent za direktno slanje</span>
                </a>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-[#1e1c18] text-white text-xs uppercase tracking-widest hover:bg-[#484436] transition-colors rounded-sm font-semibold"
                >
                  Napišite novi komentar
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-[#767269] mb-1.5 font-medium">
                    Ime i Prezime *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="npr. Marko Jovanović"
                    className="w-full px-4 py-2.5 bg-white border border-[#e5dfd5] focus:border-[#1e1c18] focus:outline-none text-xs rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-[#767269] mb-1.5 font-medium">
                    Telefon ili E-mail (opciono)
                  </label>
                  <input
                    type="text"
                    value={formData.contact || ''}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="06x xxx xxxx ili email@adresa.com"
                    className="w-full px-4 py-2.5 bg-white border border-[#e5dfd5] focus:border-[#1e1c18] focus:outline-none text-xs rounded-sm"
                  />
                </div>
              </div>

              {/* Rating selection */}
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#767269] mb-2 font-medium">
                  Vaša Ocena (1 - 5 Zvezdica)
                </label>
                <div className="flex items-center space-x-2 bg-white px-4 py-2.5 border border-[#e5dfd5] rounded-sm w-fit">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 text-stone-300 hover:text-[#bda068] transition-colors focus:outline-none"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= formData.rating
                            ? 'text-[#bda068] fill-[#bda068]'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-[#1e1c18] ml-2">
                    {formData.rating === 5 && 'Izvrsno (5/5)'}
                    {formData.rating === 4 && 'Vrlo dobro (4/5)'}
                    {formData.rating === 3 && 'Dobro (3/5)'}
                    {formData.rating === 2 && 'Dovoljno (2/5)'}
                    {formData.rating === 1 && 'Potrebno poboljšanje (1/5)'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#767269] mb-1.5 font-medium">
                  Vaš Komentar ili Utisak *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Podelite vaše iskustvo o hrani, ambijentu ili osoblju..."
                  className="w-full px-4 py-2.5 bg-white border border-[#e5dfd5] focus:border-[#1e1c18] focus:outline-none text-xs rounded-sm"
                />
              </div>

              <div className="p-3 bg-[#fbf9f5] border border-stone-200/80 rounded-sm text-[11px] text-[#767269] flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#bda068] shrink-0" />
                <span>
                  Komentar se šalje na <strong className="text-[#1e1c18]">{RECIPIENT_EMAIL}</strong> gde se odobrava pre postavljanja na sajt.
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#1e1c18] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#484436] transition-colors rounded-sm flex items-center justify-center space-x-2 shadow-xs disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 text-[#bda068] animate-spin" />
                    <span>Šaljem na odobrenje...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#bda068]" />
                    <span>Pošaljite Komentar</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
