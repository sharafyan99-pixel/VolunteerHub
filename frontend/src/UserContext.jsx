// Remembers who is logged in, and shows small pop-up messages.
//   const { user, showMessage, runAction } = useUser();
import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));   // null = nobody logged in
  const [message, setMessage] = useState('');

  function showMessage(text) {
    setMessage(text);
    setTimeout(() => setMessage(''), 2500);
  }

  function login(data) {            // data = { token, user } from the backend
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  // Runs a backend request. Shows the success text, or the error message if it fails.
  // Returns true when it worked:   if (await runAction(() => api(...), 'Saved')) { ... }
  async function runAction(request, successText) {
    try {
      await request();
      if (successText) showMessage(successText);
      return true;
    } catch (error) {
      showMessage(error.message);
      return false;
    }
  }

  return (
    <UserContext.Provider value={{ user, login, logout, showMessage, runAction }}>
      {children}
      {message && <div className="toast">{message}</div>}
    </UserContext.Provider>
  );
}
