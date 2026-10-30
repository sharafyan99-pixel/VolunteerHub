import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext.jsx';
import SettingsLayout from '../components/SettingsLayout.jsx';

export default function Logout() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  function handleYes() {
    logout();
    navigate('/');
  }

  return (
    <SettingsLayout>
      <div className="card" style={{ maxWidth: 420, margin: '30px auto', textAlign: 'center' }}>
        <div style={{ fontSize: 40 }}>🚪</div>
        <h2>Log out of VolunteerHub?</h2>
        <p>You will need to sign in again to see your dashboard.</p>
        <div className="card" style={{ background: '#eee' }}><b>{user.name}</b><br /><small>{user.email}</small></div>
        <p><button className="btn" onClick={handleYes}>Yes</button>{' '}
          <button className="btn o" onClick={() => navigate(-1)}>No</button></p>
      </div>
    </SettingsLayout>
  );
}
