import { CommentData } from '../types';

const STORAGE_KEY_APPROVED = 'slovanka_approved_comments';
const STORAGE_KEY_PENDING = 'slovanka_pending_comments';
const STORAGE_KEY_PIN = 'slovanka_admin_pin';
const STORAGE_KEY_RESET_CODE = 'slovanka_admin_reset_code';

export const DEFAULT_ADMIN_PIN = '1234';
export const ADMIN_PIN = '1234'; // backward compatibility
export const ADMIN_RECOVERY_EMAIL = 'vlado.poljovka82@gmail.com';
export const RECIPIENT_EMAIL = 'info@slovankacaffe.com';

export function getAdminPin(): string {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_PIN;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PIN);
    return saved && saved.trim().length > 0 ? saved.trim() : DEFAULT_ADMIN_PIN;
  } catch {
    return DEFAULT_ADMIN_PIN;
  }
}

export function setAdminPin(newPin: string): boolean {
  if (typeof window === 'undefined') return false;
  if (!newPin || newPin.trim().length < 4) return false;
  try {
    localStorage.setItem(STORAGE_KEY_PIN, newPin.trim());
    return true;
  } catch {
    return false;
  }
}

export function resetAdminPinToDefault(): string {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY_PIN);
      localStorage.removeItem(STORAGE_KEY_RESET_CODE);
    } catch (err) {
      console.error(err);
    }
  }
  return DEFAULT_ADMIN_PIN;
}

export function generatePinResetCode(): { code: string; expiresAt: number } {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_RESET_CODE, JSON.stringify({ code, expiresAt }));
    } catch (err) {
      console.error(err);
    }
  }
  return { code, expiresAt };
}

export function verifyPinResetCode(enteredCode: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const data = localStorage.getItem(STORAGE_KEY_RESET_CODE);
    if (!data) return false;
    const parsed = JSON.parse(data);
    if (parsed.code && parsed.expiresAt) {
      if (Date.now() > parsed.expiresAt) {
        localStorage.removeItem(STORAGE_KEY_RESET_CODE);
        return false;
      }
      if (parsed.code.toString().trim() === enteredCode.trim()) {
        localStorage.removeItem(STORAGE_KEY_RESET_CODE);
        return true;
      }
    }
  } catch (err) {
    console.error(err);
  }
  return false;
}

export const DEFAULT_APPROVED_COMMENTS: CommentData[] = [
  {
    id: 'c_default_1',
    fullName: 'Jovan M.',
    rating: 5,
    comment: 'Najbolja Slovan pica sa duplim testom u celoj Selenči i okolini! Uvek toplo i sveže pripremljeno.',
    createdAt: 'Pre 2 dana',
    status: 'approved',
  },
  {
    id: 'c_default_2',
    fullName: 'Sanja P.',
    rating: 5,
    comment: 'Predivna letnja terasa, izuzetno ljubazno osoblje i omiljena jutarnja espreso kafa.',
    createdAt: 'Pre 5 dana',
    status: 'approved',
  },
  {
    id: 'c_default_3',
    fullName: 'Milan K.',
    rating: 5,
    comment: 'Domaće kobasice sa senfom i pecivom su fantastične. Pravi domaći ukus Selenče.',
    createdAt: 'Pre nedelju dana',
    status: 'approved',
  },
];

export function getApprovedComments(): CommentData[] {
  if (typeof window === 'undefined') return DEFAULT_APPROVED_COMMENTS;
  try {
    const data = localStorage.getItem(STORAGE_KEY_APPROVED);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_APPROVED, JSON.stringify(DEFAULT_APPROVED_COMMENTS));
      return DEFAULT_APPROVED_COMMENTS;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_APPROVED_COMMENTS;
  } catch (err) {
    console.error('Error reading approved comments', err);
    return DEFAULT_APPROVED_COMMENTS;
  }
}

export function saveApprovedComments(comments: CommentData[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_APPROVED, JSON.stringify(comments));
    window.dispatchEvent(new Event('slovanka_comments_updated'));
  } catch (err) {
    console.error('Error saving approved comments', err);
  }
}

export function getPendingComments(): CommentData[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY_PENDING);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading pending comments', err);
    return [];
  }
}

export function savePendingComments(comments: CommentData[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PENDING, JSON.stringify(comments));
    window.dispatchEvent(new Event('slovanka_comments_updated'));
  } catch (err) {
    console.error('Error saving pending comments', err);
  }
}

export function createPendingComment(
  data: Omit<CommentData, 'id' | 'status' | 'createdAt'>
): CommentData {
  const newComment: CommentData = {
    ...data,
    id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    status: 'pending',
    createdAt: new Date().toLocaleDateString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  const pending = getPendingComments();
  savePendingComments([newComment, ...pending]);
  return newComment;
}

export function generateApprovalLink(comment: CommentData): string {
  if (typeof window === 'undefined') return '';
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  const params = new URLSearchParams();
  params.set('action', 'approve');
  params.set('id', comment.id || '');
  params.set('autor', comment.fullName);
  params.set('ocena', String(comment.rating));
  params.set('tekst', comment.comment);
  params.set('token', 'slovanka2026');

  return `${origin}${pathname}?${params.toString()}#kontakt`;
}

export function getMailtoUrl(comment: CommentData): string {
  const approvalLink = generateApprovalLink(comment);
  const subject = encodeURIComponent(`Novi komentar za Slovanka Caffe: ${comment.fullName} (${comment.rating}★)`);
  const body = encodeURIComponent(
`Primljen je novi komentar posetilaca za Slovanka Caffe Pizzeria!

PODACI O GOSTU:
---------------------------------------------
Ime i prezime: ${comment.fullName}
Kontakt telefon/email: ${comment.contact || 'Nije navedeno'}
Ocena: ${comment.rating}/5 zvezdica
Datum: ${comment.createdAt || new Date().toLocaleString('sr-RS')}

KOMENTAR:
"${comment.comment}"

=============================================
KAKO ODOBRITI OVAJ KOMENTAR ZA SAJT:
=============================================
Kliknite na sledeći link da odobrite i odmah objavite komentar na sajtu:
${approvalLink}

(Alternativno: posetite sajt i u dnu stranice otvorite "Moderacija komentara" sa PIN kodom: ${ADMIN_PIN})
=============================================
`
  );

  return `mailto:${RECIPIENT_EMAIL}?subject=${subject}&body=${body}`;
}

export async function sendCommentEmail(comment: CommentData): Promise<{ success: boolean; error?: string }> {
  const approvalLink = generateApprovalLink(comment);

  try {
    const payload = {
      _subject: `Novi komentar za Slovanka Caffe: ${comment.fullName} (${comment.rating}★)`,
      _replyto: comment.contact?.includes('@') ? comment.contact : undefined,
      _template: 'table',
      _captcha: 'false',
      'Ime i Prezime': comment.fullName,
      'Kontakt Gosta': comment.contact || 'Nije navedeno',
      'Ocena': `${comment.rating} / 5 zvezdica`,
      'Komentar': comment.comment,
      'Vreme Slanja': comment.createdAt || new Date().toLocaleString('sr-RS'),
      'KLIKNITE ZA ODOBRENJE NA SAJTU': approvalLink,
      'Admin Moderacija PIN': ADMIN_PIN,
    };

    const res = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return { success: true };
    } else {
      return { success: false, error: 'Server nije prihvatio zahtev' };
    }
  } catch (err: any) {
    console.warn('FormSubmit fetch failed, mailto fallback available', err);
    return { success: false, error: err?.message || 'Greška u konekciji' };
  }
}

export function approveComment(id: string): CommentData | null {
  const pending = getPendingComments();
  const index = pending.findIndex((c) => c.id === id);
  let commentToApprove: CommentData | null = null;

  if (index !== -1) {
    commentToApprove = { ...pending[index], status: 'approved' };
    const remainingPending = pending.filter((c) => c.id !== id);
    savePendingComments(remainingPending);
  }

  if (commentToApprove) {
    const approved = getApprovedComments();
    const filtered = approved.filter((c) => c.id !== id);
    saveApprovedComments([commentToApprove, ...filtered]);
    return commentToApprove;
  }

  return null;
}

export function rejectComment(id: string): void {
  const pending = getPendingComments();
  const remaining = pending.filter((c) => c.id !== id);
  savePendingComments(remaining);
}

export function deleteApprovedComment(id: string): void {
  const approved = getApprovedComments();
  const remaining = approved.filter((c) => c.id !== id);
  saveApprovedComments(remaining);
}

export function addDirectApprovedComment(comment: Omit<CommentData, 'id' | 'status' | 'createdAt'>): CommentData {
  const newComment: CommentData = {
    ...comment,
    id: `c_app_${Date.now()}`,
    status: 'approved',
    createdAt: new Date().toLocaleDateString('sr-RS'),
  };
  const current = getApprovedComments();
  saveApprovedComments([newComment, ...current]);
  return newComment;
}

export function checkAndProcessUrlApproval(): { approved: boolean; comment?: CommentData } {
  if (typeof window === 'undefined') return { approved: false };

  const params = new URLSearchParams(window.location.search);
  const action = params.get('action');
  const token = params.get('token');
  const id = params.get('id');
  const autor = params.get('autor');
  const ocena = params.get('ocena');
  const tekst = params.get('tekst');

  if ((action === 'approve' || params.has('odobri')) && (token === 'slovanka2026' || !token)) {
    const commentId = id || params.get('odobri') || `c_url_${Date.now()}`;
    const commentAuthor = autor || 'Gost';
    const commentRating = ocena ? parseInt(ocena, 10) : 5;
    const commentText = tekst || '';

    // Check if in pending
    const approvedFromPending = approveComment(commentId);
    let finalComment: CommentData;

    if (approvedFromPending) {
      finalComment = approvedFromPending;
    } else {
      // Add directly as approved
      finalComment = {
        id: commentId,
        fullName: commentAuthor,
        rating: isNaN(commentRating) ? 5 : commentRating,
        comment: commentText || 'Izvrsno iskustvo u Slovanki!',
        status: 'approved',
        createdAt: 'Odobreno od strane administratora',
      };
      const existing = getApprovedComments().filter((c) => c.id !== commentId);
      saveApprovedComments([finalComment, ...existing]);
    }

    // Clean URL
    try {
      const newUrl = window.location.origin + window.location.pathname + '#kontakt';
      window.history.replaceState({}, document.title, newUrl);
    } catch (_) {}

    return { approved: true, comment: finalComment };
  }

  return { approved: false };
}
