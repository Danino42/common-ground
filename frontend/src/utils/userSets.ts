const KEY = 'cg_user_sets';

export interface UserSet {
  id: string;
  name: string;
  description: string;
  category: string;
  cards: { id: string; text: string }[];
  created_at: string;
}

export function getUserSets(): UserSet[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export function saveUserSet(set: UserSet) {
  const existing = getUserSets().filter(s => s.id !== set.id);
  localStorage.setItem(KEY, JSON.stringify([set, ...existing]));
}

export function deleteUserSet(id: string) {
  localStorage.setItem(KEY, JSON.stringify(getUserSets().filter(s => s.id !== id)));
}