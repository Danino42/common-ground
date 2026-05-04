// Always use the same host as the frontend, just different port
// export const API_URL = `${window.location.protocol}//${window.location.hostname}:8000`;

//For production replace:
export const API_URL = import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:8000`;