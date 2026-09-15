import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  MessageSquare,
  UtensilsCrossed,
  FileEdit,
  LogOut,
  Key,
  Mail,
  ArrowLeft,
  Check,
  AlertCircle,
  GlassWater,
} from 'lucide-react';
import { CommentData } from '../types';
import {
  getAdminPin,
  setAdminPin,
  generatePinResetCode,
  verifyPinResetCode,
  ADMIN_RECOVERY_EMAIL,
  getApprovedComments,
  getPendingComments,
} from '../utils/commentsStorage';
import { AdminCommentsTab } from './admin/AdminCommentsTab';
import { AdminMenuTab } from './admin/AdminMenuTab';
import { AdminCocktailsTab } from './admin/AdminCocktailsTab';
import { AdminTextTab } from './admin/AdminTextTab';
import { AdminPinSecurityTab } from './admin/AdminPinSecurityTab';

interface AdminCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommentsChanged?: () => void;
}

type MainTab = 'comments' | 'menu' | 'cocktails' | 'text' | 'security';

export const AdminCommentsModal: React.FC<AdminCommentsModalProps> = ({
  isOpen,
  onClose,
  onCommentsChanged,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [mainTab, setMainTab] = useState<MainTab>('comments');

  // Forgot PIN state
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [resetCodeSent, setResetCodeSent] = useState(false);
  const [demoCodeHint, setDemoCodeHint] = useState<string | null>(null);
  const [inputResetCode, setInputResetCode] = useState('');
  const [inputNewPin, setInputNewPin] = useState('');
  const [inputConfirmPin, setInputConfirmPin] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  const [pending, setPending] = useState<CommentData[]>([]);
  const [approved, setApproved] = useState<CommentData[]>([]);

  const refreshComments = () => {
    setPending(getPendingComments());
    setApproved(getApprovedComments());
    if (onCommentsChanged) onCommentsChanged();
  };

  useEffect(() => {
    if (isOpen) {
      refreshComments();
      setIsForgotMode(false);
      setResetError(null);
      setResetSuccess(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPin = getAdminPin();
    if (pinInput.trim() === currentPin) {
      setIsAuthenticated(true);
      setPinError(false);
      refreshComments();
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPinInput('');
  };

  // Slanje koda za reset PIN-a
  const handleSendResetCode = () => {
    setResetError(null);
    const { code } = generatePinResetCode();
    setDemoCodeHint(code);
    setResetCodeSent(true);

    const subject = encodeURIComponent('Kod za reset PIN-a - Caffe Pizzeria Slovanka');
    const body = encodeURIComponent(
      `Zdravo Vlado,\n\nVaš jednokratni sigurnosni kod za reset administratorskog PIN-a je:\n\n${code}\n\nOvaj kod važi narednih 15 minuta.\n\nCaffe Pizzeria Slovanka Selenča`
    );

    // Otvori mailto klijent za slanje
    window.open(`mailto:${ADMIN_RECOVERY_EMAIL}?subject=${subject}&body=${body}`, '_blank');
  };

  // Potvrda koda i postavljanje novog PIN-a
  const handleConfirmResetPin = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    if (!inputResetCode.trim()) {
      setResetError('Molimo unesite sigurnosni 6-cifreni kod sa emaila.');
      return;
    }

    if (inputNewPin.trim().length < 4) {
      setResetError('Novi PIN mora sadržati najmanje 4 cifre ili karaktera.');
      return;
    }

    if (inputNewPin.trim() !== inputConfirmPin.trim()) {
      setResetError('Novi PIN i potvrda novog PIN-a se ne poklapaju.');
      return;
    }

    const isCodeValid = verifyPinResetCode(inputResetCode.trim());
    if (!isCodeValid) {
      setResetError('Uneti sigurnosni kod je nevažeći ili je istekao (15 min).');
      return;
    }

    const saved = setAdminPin(inputNewPin.trim());
    if (saved) {
      setResetSuccess('PIN kod je uspešno promenjen! Možete se prijaviti novim PIN-om.');
      setPinInput(inputNewPin.trim());
      setTimeout(() => {
        setIsForgotMode(false);
        setResetSuccess(null);
        setResetCodeSent(false);
        setDemoCodeHint(null);
        setInputResetCode('');
        setInputNewPin('');
        setInputConfirmPin('');
      }, 1800);
    } else {
      setResetError('Greška pri snimanju novog PIN koda.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#fbf9f5] border border-[#bda068] w-full max-w-4xl rounded-sm shadow-2xl overflow-hidden flex flex-col h-[90vh] max-h-[850px]">
        {/* Modal Header */}
        <div className="bg-[#1e1c18] text-[#fbf9f5] px-5 py-4 flex items-center justify-between border-b border-[#3a362d] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#bda068]/20 rounded text-[#bda068]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg tracking-wider uppercase text-white font-medium">
                Administratorski Panel • Slovanka
              </h3>
              <p className="text-[11px] text-stone-400">
                Moderacija Komentara • Izmena Jelovnika • Uređivanje Tekstova • PIN
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-2.5 py-1 text-xs text-stone-400 hover:text-white hover:bg-white/10 rounded flex items-center space-x-1 transition-colors"
                title="Odjavi se iz panela"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Odjavi se</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white hover:bg-white/10 rounded-sm transition-colors"
              title="Zatvori panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-12 text-center my-auto overflow-y-auto max-w-lg mx-auto w-full">
            {!isForgotMode ? (
              <>
                <div className="w-14 h-14 rounded-full bg-[#f4f0e8] border border-[#e5dfd5] text-[#bda068] flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Lock className="w-7 h-7" />
                </div>
                <h4 className="font-serif text-2xl text-[#1e1c18] mb-1.5 font-medium">
                  Prijava za Administratore
                </h4>
                <p className="text-xs text-[#767269] max-w-sm mx-auto mb-6 leading-relaxed">
                  Unesite bezbednosni PIN kod kako biste pristupili moderaciji komentara, jelovnika, tekstova i promeni podešavanja.
                </p>

                {resetSuccess && (
                  <div className="p-3 mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center justify-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{resetSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="max-w-xs mx-auto space-y-4">
                  <div>
                    <input
                      type="password"
                      value={pinInput}
                      onChange={(e) => {
                        setPinInput(e.target.value);
                        setPinError(false);
                      }}
                      placeholder="PIN kod"
                      autoFocus
                      className="w-full text-center px-4 py-3 bg-white border border-[#e5dfd5] focus:border-[#1e1c18] focus:outline-none text-base font-mono tracking-widest rounded-sm shadow-inner"
                    />
                    {pinError && (
                      <p className="text-xs text-red-600 mt-2 font-medium">
                        Pogrešan PIN kod. Pokušajte ponovo ili resetujte PIN preko emaila.
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#1e1c18] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#484436] transition-colors rounded-sm shadow-sm"
                  >
                    Prijavi se u Panel
                  </button>
                </form>

                <div className="mt-6 pt-4 border-t border-[#e5dfd5]/60 flex flex-col items-center space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(true);
                      setResetError(null);
                    }}
                    className="text-xs text-[#bda068] hover:text-[#1e1c18] font-medium transition-colors flex items-center space-x-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Zaboravili ste PIN? Resetujte preko emaila</span>
                  </button>
                  <span className="text-[11px] text-stone-400">
                    Autorizovana adresa: <span className="font-mono text-stone-600">{ADMIN_RECOVERY_EMAIL}</span>
                  </span>
                </div>
              </>
            ) : (
              /* FORGOT PIN VIEW */
              <div className="text-left bg-white p-6 border border-[#e5dfd5] rounded-sm shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#f4f0e8]">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-[#bda068]" />
                    <h5 className="font-serif text-base font-semibold text-[#1e1c18]">
                      Resetovanje PIN Koda Preko Emaila
                    </h5>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsForgotMode(false)}
                    className="text-xs text-stone-500 hover:text-stone-800 flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Nazad na prijavu</span>
                  </button>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Zahtev za reset se šalje na verifikovanu administratorsku adresu:{' '}
                  <strong className="font-mono text-stone-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    {ADMIN_RECOVERY_EMAIL}
                  </strong>
                </p>

                {resetError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{resetError}</span>
                  </div>
                )}

                {resetSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{resetSuccess}</span>
                  </div>
                )}

                {!resetCodeSent ? (
                  <div className="space-y-4 pt-1">
                    <p className="text-xs text-stone-500">
                      Klikom na dugme ispod generiše se 6-cifreni kod i priprema poruka na Vašoj email adresi.
                    </p>
                    <button
                      type="button"
                      onClick={handleSendResetCode}
                      className="w-full py-2.5 bg-[#1e1c18] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#484436] rounded-sm transition-colors flex items-center justify-center space-x-2"
                    >
                      <Mail className="w-4 h-4 text-[#bda068]" />
                      <span>Pošalji Sigurnosni Kod na {ADMIN_RECOVERY_EMAIL}</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleConfirmResetPin} className="space-y-3.5 pt-1">
                    {demoCodeHint && (
                      <div className="p-3 bg-stone-50 border border-stone-300 rounded text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-stone-800">Generisani sigurnosni kod:</span>
                          <span className="font-mono font-bold text-amber-700 text-sm tracking-wider bg-white px-2 py-0.5 rounded border border-stone-300">
                            {demoCodeHint}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-500">
                          (Kod je pripremljen za slanje na {ADMIN_RECOVERY_EMAIL}. Možete ga uneti direktno ispod).
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Sigurnosni Kod sa Emaila (6 cifara) *
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={inputResetCode}
                        onChange={(e) => setInputResetCode(e.target.value)}
                        placeholder="Npr. 123456"
                        className="w-full px-3 py-2 text-xs font-mono tracking-widest bg-[#fbf9f5] border border-stone-300 focus:border-[#1e1c18] focus:bg-white focus:outline-none rounded-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Novi PIN Kod *
                        </label>
                        <input
                          type="password"
                          required
                          value={inputNewPin}
                          onChange={(e) => setInputNewPin(e.target.value)}
                          placeholder="Novi PIN (min 4 cifre)"
                          className="w-full px-3 py-2 text-xs font-mono bg-[#fbf9f5] border border-stone-300 focus:border-[#1e1c18] focus:bg-white focus:outline-none rounded-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Potvrdite Novi PIN *
                        </label>
                        <input
                          type="password"
                          required
                          value={inputConfirmPin}
                          onChange={(e) => setInputConfirmPin(e.target.value)}
                          placeholder="Ponovite novi PIN"
                          className="w-full px-3 py-2 text-xs font-mono bg-[#fbf9f5] border border-stone-300 focus:border-[#1e1c18] focus:bg-white focus:outline-none rounded-sm"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleSendResetCode}
                        className="text-[11px] text-stone-500 hover:text-stone-800 underline"
                      >
                        Pošalji novi kod ponovo
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#1e1c18] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#484436] rounded-sm transition-colors shadow-xs"
                      >
                        Potvrdi i Postavi Novi PIN
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Top Level 4 Tabs */}
            <div className="flex border-b border-[#e5dfd5] bg-[#ece7dc] text-xs font-semibold uppercase tracking-wider shrink-0 overflow-x-auto">
              <button
                onClick={() => setMainTab('comments')}
                className={`flex-1 min-w-[140px] py-3.5 px-3 border-b-2 flex items-center justify-center space-x-1.5 sm:space-x-2 transition-all ${
                  mainTab === 'comments'
                    ? 'border-[#bda068] bg-[#fbf9f5] text-[#1e1c18] font-bold shadow-xs'
                    : 'border-transparent text-[#767269] hover:text-[#1e1c18] hover:bg-black/5'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-[#bda068]" />
                <span>Komentari</span>
                {pending.length > 0 && (
                  <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded-full font-mono">
                    {pending.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMainTab('menu')}
                className={`flex-1 min-w-[130px] py-3.5 px-3 border-b-2 flex items-center justify-center space-x-1.5 sm:space-x-2 transition-all ${
                  mainTab === 'menu'
                    ? 'border-[#bda068] bg-[#fbf9f5] text-[#1e1c18] font-bold shadow-xs'
                    : 'border-transparent text-[#767269] hover:text-[#1e1c18] hover:bg-black/5'
                }`}
              >
                <UtensilsCrossed className="w-4 h-4 text-[#bda068]" />
                <span>Jelovnik & Cene</span>
              </button>

              <button
                onClick={() => setMainTab('cocktails')}
                className={`flex-1 min-w-[130px] py-3.5 px-3 border-b-2 flex items-center justify-center space-x-1.5 sm:space-x-2 transition-all ${
                  mainTab === 'cocktails'
                    ? 'border-[#bda068] bg-[#fbf9f5] text-[#1e1c18] font-bold shadow-xs'
                    : 'border-transparent text-[#767269] hover:text-[#1e1c18] hover:bg-black/5'
                }`}
              >
                <GlassWater className="w-4 h-4 text-[#bda068]" />
                <span>Kokteli</span>
              </button>

              <button
                onClick={() => setMainTab('text')}
                className={`flex-1 min-w-[130px] py-3.5 px-3 border-b-2 flex items-center justify-center space-x-1.5 sm:space-x-2 transition-all ${
                  mainTab === 'text'
                    ? 'border-[#bda068] bg-[#fbf9f5] text-[#1e1c18] font-bold shadow-xs'
                    : 'border-transparent text-[#767269] hover:text-[#1e1c18] hover:bg-black/5'
                }`}
              >
                <FileEdit className="w-4 h-4 text-[#bda068]" />
                <span>Tekstovi Sajta</span>
              </button>

              <button
                onClick={() => setMainTab('security')}
                className={`flex-1 min-w-[130px] py-3.5 px-3 border-b-2 flex items-center justify-center space-x-1.5 sm:space-x-2 transition-all ${
                  mainTab === 'security'
                    ? 'border-[#bda068] bg-[#fbf9f5] text-[#1e1c18] font-bold shadow-xs'
                    : 'border-transparent text-[#767269] hover:text-[#1e1c18] hover:bg-black/5'
                }`}
              >
                <Key className="w-4 h-4 text-[#bda068]" />
                <span>Sigurnost & PIN</span>
              </button>
            </div>

            {/* Tab Contents */}
            {mainTab === 'comments' && (
              <AdminCommentsTab
                pending={pending}
                approved={approved}
                onRefresh={refreshComments}
              />
            )}

            {mainTab === 'menu' && <AdminMenuTab />}

            {mainTab === 'cocktails' && <AdminCocktailsTab />}

            {mainTab === 'text' && <AdminTextTab />}

            {mainTab === 'security' && <AdminPinSecurityTab />}
          </div>
        )}
      </div>
    </div>
  );
};
