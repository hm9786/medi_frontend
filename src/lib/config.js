const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';
const normalizedBaseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

export const API_BASE_URL = normalizedBaseUrl;

export const apiUrl = (path = '') => {
  if (!path) return API_BASE_URL;

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

