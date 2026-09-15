import React, { useState } from 'react';
import {
  Clock,
  Check,
  Trash2,
  Star,
  Mail,
  Plus,
  MessageSquareQuote,
  ExternalLink,
} from 'lucide-react';
import { CommentData } from '../../types';
import {
  RECIPIENT_EMAIL,
  approveComment,
  rejectComment,
  deleteApprovedComment,
  addDirectApprovedComment,
} from '../../utils/commentsStorage';

interface AdminCommentsTabProps {
  pending: CommentData[];
  approved: CommentData[];
  onRefresh: () => void;
}

export const AdminCommentsTab: React.FC<AdminCommentsTabProps> = ({
  pending,
  approved,
  onRefresh,
}) => {
  const [subTab, setSubTab] = useState<'pending' | 'approved' | 'add'>('pending');
  const [manualForm, setManualForm] = useState({
    fullName: '',
    contact: '',
    rating: 5,
    comment: '',
  });
  const [manualSuccess, setManualSuccess] = useState(false);

  const handleApprove = (id: string) => {
    approveComment(id);
    onRefresh();
  };

  const handleReject = (id: string) => {
    if (confirm('Da li ste sigurni da želite da odbijete i obrišete ovaj komentar?')) {
      rejectComment(id);
      onRefresh();
    }
  };

  const handleDeleteApproved = (id: string) => {
    if (confirm('Da li ste sigurni da želite da uklonite ovaj komentar sa sajta?')) {
      deleteApprovedComment(id);
      onRefresh();
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.fullName.trim() || !manualForm.comment.trim()) return;

    addDirectApprovedComment({
      fullName: manualForm.fullName.trim(),
      contact: manualForm.contact.trim() || undefined,
      rating: manualForm.rating,
      comment: manualForm.comment.trim(),
    });

    setManualForm({ fullName: '', contact: '', rating: 5, comment: '' });
    setManualSuccess(true);
    onRefresh();
    setTimeout(() => {
      setSubTab('approved');
      setManualSuccess(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Subtabs Navigation */}
      <div className="flex border-b border-[#e5dfd5] bg-[#f4f0e8]/80 text-xs font-semibold uppercase tracking-wider">
        <button
          onClick={() => setSubTab('pending')}
          className={`flex-1 py-3 px-4 border-b-2 flex items-center justify-center space-x-2 transition-colors ${
            subTab === 'pending'
              ? 'border-[#bda068] bg-white text-[#1e1c18]'
              : 'border-transparent text-[#767269] hover:text-[#1e1c18]'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-[#bda068]" />
          <span>Na čekanju ({pending.length})</span>
        </button>

        <button
          onClick={() => setSubTab('approved')}
          className={`flex-1 py-3 px-4 border-b-2 flex items-center justify-center space-x-2 transition-colors ${
            subTab === 'approved'
              ? 'border-[#bda068] bg-white text-[#1e1c18]'
              : 'border-transparent text-[#767269] hover:text-[#1e1c18]'
          }`}
        >
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>Objavljeni ({approved.length})</span>
        </button>

        <button
          onClick={() => setSubTab('add')}
          className={`flex-1 py-3 px-4 border-b-2 flex items-center justify-center space-x-2 transition-colors ${
            subTab === 'add'
              ? 'border-[#bda068] bg-white text-[#1e1c18]'
              : 'border-transparent text-[#767269] hover:text-[#1e1c18]'
          }`}
        >
          <Plus className="w-3.5 h-3.5 text-[#bda068]" />
          <span>Dodaj Direktno</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
        {/* Pending Comments */}
        {subTab === 'pending' && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs text-[#767269]">
                Komentari koji čekaju vaše odobrenje pre nego što postanu vidljivi posetiocima sajta.
              </p>
              <span className="text-[11px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded font-mono">
                {pending.length} na čekanju
              </span>
            </div>

            {pending.length === 0 ? (
              <div className="text-center py-12 bg-white border border-dashed border-[#e5dfd5] rounded-sm">
                <Check className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="font-serif text-lg text-[#1e1c18]">Nema novih komentara na čekanju</p>
                <p className="text-xs text-[#767269] mt-1">
                  Svi pristigli komentari su obrađeni ili odobreni.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pending.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 sm:p-5 rounded-sm border border-[#e5dfd5] shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="font-serif text-base font-semibold text-[#1e1c18]">
                          {item.fullName}
                        </h5>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <div className="flex text-[#bda068]">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < item.rating ? 'fill-current' : 'text-stone-300'
                                }`}
                              />
                            ))}
                          </div>
                          {item.createdAt && (
                            <span className="text-[10px] text-stone-400 font-mono">
                              • {item.createdAt}
                            </span>
                          )}
                        </div>
                      </div>

                      {item.contact && (
                        <span className="text-[11px] bg-stone-100 px-2.5 py-1 rounded text-stone-600 border border-stone-200">
                          {item.contact}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#484436] bg-[#fbf9f5] p-3 rounded border border-stone-200/70 italic leading-relaxed">
                      "{item.comment}"
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      <span className="text-[10px] text-stone-400 flex items-center space-x-1">
                        <Mail className="w-3 h-3 text-[#bda068]" />
                        <span>Poslato vlasniku na: {RECIPIENT_EMAIL}</span>
                      </span>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => item.id && handleReject(item.id)}
                          className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium rounded-sm flex items-center space-x-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Odbij</span>
                        </button>
                        <button
                          onClick={() => item.id && handleApprove(item.id)}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-sm flex items-center space-x-1 transition-colors shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Odobri i Objavi</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Approved Comments */}
        {subTab === 'approved' && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs text-[#767269]">
                Komentari koji su trenutno aktivni i prikazuju se posetiocima na stranici restorana.
              </p>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono font-semibold">
                {approved.length} objavljeno
              </span>
            </div>

            {approved.length === 0 ? (
              <div className="text-center py-12 bg-white border border-dashed border-[#e5dfd5] rounded-sm">
                <MessageSquareQuote className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <p className="font-serif text-lg text-[#1e1c18]">Trenutno nema odobrenih komentara</p>
                <p className="text-xs text-[#767269] mt-1">
                  Odobrite komentare iz taba "Na čekanju" ili dodajte novi direktno.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {approved.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-sm border border-[#e5dfd5] flex items-start justify-between shadow-2xs group hover:border-[#bda068]/60 transition-colors"
                  >
                    <div className="space-y-1.5 pr-4">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-xs text-[#1e1c18]">{item.fullName}</span>
                        <div className="flex text-[#bda068]">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < item.rating ? 'fill-current' : 'text-stone-300'
                              }`}
                            />
                          ))}
                        </div>
                        {item.createdAt && (
                          <span className="text-[10px] text-stone-400">{item.createdAt}</span>
                        )}
                      </div>
                      <p className="text-xs text-[#767269] italic">"{item.comment}"</p>
                    </div>

                    <button
                      onClick={() => item.id && handleDeleteApproved(item.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors shrink-0"
                      title="Ukloni komentar sa sajta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Directly */}
        {subTab === 'add' && (
          <form
            onSubmit={handleManualSubmit}
            className="bg-white p-5 sm:p-6 border border-[#e5dfd5] rounded-sm space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h5 className="font-serif text-base font-semibold text-[#1e1c18]">
                  Direktno Dodavanje Utiska
                </h5>
                <p className="text-[11px] text-[#767269]">
                  Ovaj komentar biće automatski objavljen na sajtu bez potrebe za odobrenjem.
                </p>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                Admin Režim
              </span>
            </div>

            {manualSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Komentar je uspešno objavljen na stranici!</span>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                Ime i Prezime / Naziv gosta *
              </label>
              <input
                type="text"
                required
                value={manualForm.fullName}
                onChange={(e) => setManualForm({ ...manualForm, fullName: e.target.value })}
                placeholder="npr. Marko Petrović"
                className="w-full px-3 py-2 border border-stone-300 text-xs focus:outline-none focus:border-[#1e1c18] rounded-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                  Kontakt (Opciono)
                </label>
                <input
                  type="text"
                  value={manualForm.contact}
                  onChange={(e) => setManualForm({ ...manualForm, contact: e.target.value })}
                  placeholder="npr. Bačka Palanka ili marko@gmail.com"
                  className="w-full px-3 py-2 border border-stone-300 text-xs focus:outline-none focus:border-[#1e1c18] rounded-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                  Ocena (1 - 5 zvezdica)
                </label>
                <div className="flex items-center space-x-2 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setManualForm({ ...manualForm, rating: star })}
                      className="p-1 text-[#bda068] hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= manualForm.rating ? 'fill-current' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-stone-600 pl-2">
                    {manualForm.rating} / 5
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                Tekst Komentara / Recenzije *
              </label>
              <textarea
                required
                rows={3}
                value={manualForm.comment}
                onChange={(e) => setManualForm({ ...manualForm, comment: e.target.value })}
                placeholder="Unesite reči pohvale, utisak o pici, ambijentu ili osoblju..."
                className="w-full px-3 py-2 border border-stone-300 text-xs focus:outline-none focus:border-[#1e1c18] rounded-sm"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#1e1c18] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#484436] rounded-sm transition-colors"
              >
                Objavi na Sajtu
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
