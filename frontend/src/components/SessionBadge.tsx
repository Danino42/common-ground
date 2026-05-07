import { getUser, isLoggedIn } from '../utils/auth';

export default function SessionBadge() {
  const sessionUser = getUser();
  const loggedIn = isLoggedIn();

  const display = loggedIn
    ? (sessionUser?.username?.trim() || sessionUser?.email?.slice(0, 5) || 'user')
    : 'Guest';

  return (
    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#991b1b' }}>
      {loggedIn ? `Logged in as ${display}` : 'Guest session'}
    </span>
  );
}