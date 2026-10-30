// api.js - one helper function to talk to the backend.
// Example:  const list = await api('/opportunities');
//           await api('/hours', { method: 'POST', body: { activity: 'Tutoring', hours: 3 } });
export async function api(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = 'Bearer ' + token;   // proves who the user is
  }

  const response = await fetch('/api' + path, {
    method: options.method || 'GET',
    headers: headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');   // the pages show this message
  }
  return data;
}

// Reads the saved Appearance settings and applies them to the whole page.
export function applyPreferences() {
  const saved = JSON.parse(localStorage.getItem('preferences') || '{}');
  let theme = saved.theme || 'light';
  if (theme === 'system') {
    theme = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.fs = saved.fontSize || 'medium';
}
