// The top bar shown on every page.
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext.jsx';

export default function Header() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const isOrg = user && user.role === 'organization';

  // NavLink gives the class "on" to the link of the page we are on
  function linkClass({ isActive }) {
    return isActive ? 'on' : '';
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header>
      <Link className="logo" to="/">VolunteerHub <small>Armenia</small></Link>

      <nav>
        {!isOrg && (
          <>
            <NavLink className={linkClass} to="/search">Find Opportunities</NavLink>
            <NavLink className={linkClass} to="/calendar">Calendar</NavLink>
            <NavLink className={linkClass} to="/dash">Dashboard</NavLink>
          </>
        )}
      </nav>

      {user ? (
        <>
          <Link to="/notif" title="Notifications" style={{ fontSize: 22 }}>🔔</Link>
          <Link to={isOrg ? '/org' : '/dash'} className="pill" style={{ color: '#111', borderColor: '#111' }}>
            {isOrg ? user.name : user.firstName}
          </Link>
          <button className="btn o sm" onClick={handleLogout}>Log out</button>
        </>
      ) : (
        <Link className="btn o sm" to="/login">Log In</Link>
      )}
    </header>
  );
}
