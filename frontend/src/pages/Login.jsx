import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useUser } from '../UserContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const data = await api('/auth/login', { method: 'POST', body: { email, password } });
      login(data);
      navigate(data.user.role === 'organization' ? '/org' : '/dash');
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <div className="split">
      <div className="side">
        <span className="pill">🤝 VolunteerHub</span>
        <h2>Welcome back</h2>
        <p>Log in to manage your volunteering activities and track your impact.</p>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <h2>Log In</h2>
        <label>Email address</label>
        <input type="email" value={email} onChange={event => setEmail(event.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={event => setPassword(event.target.value)} required />
        {errorMessage && <p style={{ color: '#b00' }}>{errorMessage}</p>}
        <button className="btn" style={{ width: '100%', marginTop: 12, padding: 12 }}>Log in</button>
        <p style={{ textAlign: 'center' }}>Don't have an account? <Link to="/signup"><b>Sign up</b></Link></p>
      </form>
    </div>
  );
}
