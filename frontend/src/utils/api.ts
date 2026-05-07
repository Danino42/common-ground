// Always use the same host as the frontend, just different port
// export const API_URL = `${window.location.protocol}//${window.location.hostname}:8000`;

import { getToken } from './auth';

export const API_URL = import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:8000`;

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

export interface CardItem { id: string; text: string; }

export interface CardSet {
  id: string;
  name: string;
  category: string;
  description: string;
  cards: CardItem[];
  author: string;
  author_email?: string;
  is_public: boolean;
  saved: boolean;
  deck_hash: string;
  created_at: string;
}

export const cardSetsApi = {
  list: async (): Promise<CardSet[]> => {
    const res = await fetch(`${API_URL}/card-sets/`, { headers: authHeaders() });
    if (!res.ok) return [];
    return res.json();
  },

  get: async (id: string): Promise<CardSet | null> => {
    const res = await fetch(`${API_URL}/card-sets/${id}`, { headers: authHeaders() });
    if (!res.ok) return null;
    return res.json();
  },

  create: async (data: {
    name: string; category: string; description: string;
    cards: CardItem[]; is_public: boolean;
  }): Promise<CardSet> => {
    const res = await fetch(`${API_URL}/card-sets/`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create card set');
    return res.json();
  },

  update: async (id: string, data: Partial<{
    name: string; category: string; description: string;
    cards: CardItem[]; is_public: boolean;
  }>): Promise<CardSet> => {
    const res = await fetch(`${API_URL}/card-sets/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update card set');
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/card-sets/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
  },

  save: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/card-sets/${id}/save`, {
      method: 'POST',
      headers: authHeaders(),
    });
  },

  unsave: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/card-sets/${id}/save`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
  },
};