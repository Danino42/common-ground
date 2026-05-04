export const card: React.CSSProperties = {
  background: 'white',
  borderRadius: 20,
  border: '1.5px solid #f0f0f0',
  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  padding: '1.5rem',
};

export const outlineBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  padding: '10px 20px', borderRadius: 12,
  border: '1.5px solid #e5e7eb', background: 'white',
  color: '#374151', fontSize: '0.9rem', fontWeight: 700,
  cursor: 'pointer', transition: 'all 0.15s',
};

export const primaryBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  padding: '10px 20px', borderRadius: 12,
  border: 'none', background: '#1c1917',
  color: 'white', fontSize: '0.9rem', fontWeight: 700,
  cursor: 'pointer', transition: 'all 0.15s',
};

export const pillBtn = (active: boolean, color = '#15803d'): React.CSSProperties => ({
  padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
  background: active ? color : '#f3f4f6',
  color: active ? 'white' : '#6b7280',
  fontSize: '0.78rem', fontWeight: 700,
  transition: 'all 0.15s',
});