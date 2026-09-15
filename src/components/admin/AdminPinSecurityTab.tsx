import React, { useState } from 'react';
import { Key, ShieldCheck, Mail, Check, AlertCircle, RefreshCw, Lock } from 'lucide-react';
import {
  getAdminPin,
  setAdminPin,
  resetAdminPinToDefault,
  ADMIN_RECOVERY_EMAIL,
} from '../../utils/commentsStorage';

export const AdminPinSecurityTab: React.FC = () => {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [activePinDisplay, setActivePinDisplay] = useState(() => getAdminPin());

  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const showNotification = (
    message: string,
    type: 'success' | 'error' | 'info' = 'success'
  ) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    const actualPin = getAdminPin();

    if (currentPin.trim() !== actualPin) {
      showNotification('Trenutni PIN nije tačan. Molimo unesite ispravan aktuelni PIN.', 'error');
      return;
    }

    if (newPin.trim().length < 4) {
      showNotification('Novi PIN mora sadržati najmanje 4 cifre/karaktera.', 'error');
      return;
    }

    if (newPin.trim() !== confirmPin.trim()) {
      showNotification('Novi PIN i potvrda novog PIN-a se ne poklapaju.', 'error');
      return;
    }

    const ok = setAdminPin(newPin.trim());
    if (ok) {
      setActivePinDisplay(newPin.trim());
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      showNotification('PIN kod je uspešno promenjen! Sačuvajte novi PIN na sigurnom mestu.', 'success');
    } else {
      showNotification('Greška prilikom čuvanja novog PIN koda.', 'error');
    }
  };

  const handleResetDefaultPin = () => {
    if (
      confirm(
        'Da li ste sigurni da želite da vratite podrazumevani PIN kod (1234)?'
      )
    ) {
      const def = resetAdminPinToDefault();
      setActivePinDisplay(def);
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      showNotification('PIN kod je vraćen na podrazumevanu fabričku vrednost: 1234', 'info');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Toast Alert */}
      {notification && (
        <div
          className={`px-4 py-3 rounded text-xs flex items-center justify-between shadow-xs ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : notification.type === 'error'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-stone-100 text-stone-800 border border-stone-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header card */}
      <div className="bg-white p-5 border border-[#e5dfd5] rounded-sm shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#bda068] mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              Sigurnosna Podešavanja Panela
            </span>
          </div>
          <h4 className="font-serif text-lg text-[#1e1c18] font-medium">
            Promena Administratorskog PIN Koda
          </h4>
          <p className="text-xs text-[#767269] mt-0.5">
            Upravljajte pristupnim PIN kodom koji štiti moderaciju komentara, jelovnika i tekstova.
          </p>
        </div>

        <div className="p-3 bg-[#fbf9f5] border border-[#e5dfd5] rounded text-right shrink-0">
          <span className="text-[10px] text-stone-500 block uppercase tracking-wider">
            Status PIN-a
          </span>
          <span className="text-xs font-mono font-semibold text-[#1e1c18]">
            {activePinDisplay === '1234' ? 'Podrazumevani (1234)' : 'Korisnički prilagođen'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-2 bg-white p-6 border border-[#e5dfd5] rounded-sm shadow-xs space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#f4f0e8]">
            <Key className="w-4 h-4 text-[#bda068]" />
            <h5 className="font-serif text-sm font-semibold text-[#1e1c18]">
              Formular za Izmenu PIN-a
            </h5>
          </div>

          <form onSubmit={handleUpdatePin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Trenutni PIN Kod *
              </label>
              <input
                type="password"
                required
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value)}
                placeholder="Unesite trenutni PIN"
                className="w-full px-3 py-2 text-xs font-mono bg-[#fbf9f5] border border-stone-300 focus:border-[#1e1c18] focus:bg-white focus:outline-none rounded-sm transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Novi PIN Kod (min. 4 cifre) *
                </label>
                <input
                  type="password"
                  required
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Npr. 5821"
                  className="w-full px-3 py-2 text-xs font-mono bg-[#fbf9f5] border border-stone-300 focus:border-[#1e1c18] focus:bg-white focus:outline-none rounded-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Potvrdite Novi PIN Kod *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="Ponovite novi PIN"
                  className="w-full px-3 py-2 text-xs font-mono bg-[#fbf9f5] border border-stone-300 focus:border-[#1e1c18] focus:bg-white focus:outline-none rounded-sm transition-colors"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#1e1c18] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#484436] rounded-sm transition-colors shadow-xs flex items-center space-x-2"
              >
                <Lock className="w-3.5 h-3.5 text-[#bda068]" />
                <span>Sačuvaj Novi PIN</span>
              </button>

              <button
                type="button"
                onClick={handleResetDefaultPin}
                className="px-3 py-2 text-xs text-stone-600 hover:text-red-700 hover:bg-red-50 border border-stone-300 hover:border-red-300 rounded-sm transition-colors flex items-center space-x-1.5"
                title="Vrati podrazumevani PIN na 1234"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Vrati na 1234</span>
              </button>
            </div>
          </form>
        </div>

        {/* Recovery Info Column */}
        <div className="bg-[#fbf9f5] p-5 border border-[#e5dfd5] rounded-sm shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-[#1e1c18]">
            <Mail className="w-4 h-4 text-[#bda068]" />
            <h5 className="font-serif text-sm font-semibold">
              Email za Oporavak PIN-a
            </h5>
          </div>

          <div className="p-3.5 bg-white border border-[#e5dfd5] rounded-sm space-y-2">
            <span className="text-[10px] text-stone-500 uppercase tracking-wider block">
              Ovlašćena Email Adresa
            </span>
            <span className="text-xs font-mono font-bold text-stone-900 break-all select-all block bg-[#f4f0e8] p-2 rounded border border-stone-200">
              {ADMIN_RECOVERY_EMAIL}
            </span>
            <p className="text-[11px] text-stone-600 leading-relaxed pt-1">
              Ukoliko administrator zaboravi PIN kod, na početnom ekranu za prijavu postoji opcija <strong>„Zaboravili ste PIN?”</strong> preko koje se generiše sigurnosni kod i šalje na ovu verifikovanu adresu.
            </p>
          </div>

          <div className="border-t border-[#e5dfd5] pt-3 text-[11px] text-stone-500 space-y-1">
            <p className="font-medium text-stone-700">Napomena o bezbednosti:</p>
            <p>• PIN se bezbedno pamti u vašem pretraživaču.</p>
            <p>• Početni (fabrički) PIN je: <strong className="font-mono text-stone-800">1234</strong>.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
