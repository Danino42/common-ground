import { getToken, isLoggedIn } from './auth';
import { API_URL } from './api';

const LOCAL_KEY = 'cg_saved_sets';

// ── Local (guest) ─────────────────────────────────────────────────────────────

export function getLocalSavedIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  } catch { return []; }
}

export function setLocalSavedIds(ids: string[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(ids));
}

// ── Remote (logged-in) ────────────────────────────────────────────────────────

export async function fetchRemoteSavedIds(): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/facilitators/me/saved-sets`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.saved_card_sets ?? [];
  } catch { return []; }
}

export async function pushRemoteSavedIds(ids: string[]) {
  if (!isLoggedIn()) return;
  try {
    await fetch(`${API_URL}/facilitators/me/saved-sets`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ saved_card_sets: ids }),
    });
  } catch {}
}

// ── Unified API used by CardLibrary ──────────────────────────────────────────

export async function loadSavedIds(): Promise<string[]> {
  if (isLoggedIn()) return fetchRemoteSavedIds();
  return getLocalSavedIds();
}

export async function saveSavedIds(ids: string[]) {
  if (isLoggedIn()) {
    await pushRemoteSavedIds(ids);
  } else {
    setLocalSavedIds(ids);
  }
}