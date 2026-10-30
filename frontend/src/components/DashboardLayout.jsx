// The frame around dashboard pages: a menu on the left, the page content on the right.
import { NavLink } from 'react-router-dom';
import { useUser } from '../UserContext.jsx';
import useLoad from '../hooks/useLoad.js';

const volunteerMenu = [
  ['/dash', 'Dashboard'], ['/apps', 'My applications'], ['/hours', 'Hour log'], ['/certs', 'Certificates'],
  ['/reviews', 'Reviews'], ['/calendar', 'Calendar'], ['/profile', 'My Profile'], ['/settings', 'Settings']
];
const organizationMenu = [
  ['/org', 'Dashboard'], ['/manage', 'Manage listings'], ['/apply', 'Applicants'], ['/approve', 'Approve hours'],
  ['/issue', 'Issue certs & rate'], ['/orgprof', 'Org Profile'], ['/settings', 'Settings']
];

export default function DashboardLayout({ children }) {
  const { user } = useUser();
  const [profile] = useLoad('/users/me', null);   // to show the up-to-date rating
  const menu = user.role === 'organization' ? organizationMenu : volunteerMenu;
  const rating = profile ? profile.user.rating : 0;

  return (
    <div className="dash">
      <aside className="menu">
        <b>{user.name}</b>
        <small>⭐ {rating} rating</small>
        {menu.map(([address, label]) => (
          <NavLink key={address} to={address} className={({ isActive }) => (isActive ? 'on' : '')}>{label}</NavLink>
        ))}
      </aside>
      <section className="main">{children}</section>
    </div>
  );
}
