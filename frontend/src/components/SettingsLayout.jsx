// The frame around the Settings pages: a light-blue menu on the left.
import { NavLink } from 'react-router-dom';

const settingsMenu = [
  ['/settings', 'Notifications'], ['/account', 'Account'], ['/privacy', 'Privacy'],
  ['/appearance', 'Appearance'], ['/security', 'Security'], ['/logout', 'Log out']
];

export default function SettingsLayout({ children }) {
  function linkStyle({ isActive }) {
    const style = { border: 0, borderRadius: 0, padding: 14 };
    if (isActive) {
      style.background = '#9cb0a6';
      style.fontWeight = 700;
    }
    return style;
  }

  return (
    <div className="dash" style={{ gridTemplateColumns: '200px 1fr' }}>
      <aside className="menu" style={{ background: '#dfeeee', gap: 0 }}>
        {settingsMenu.map(([address, label]) => (
          <NavLink key={address} to={address} style={linkStyle}>{label}</NavLink>
        ))}
      </aside>
      <section className="form" style={{ maxWidth: 'none', padding: '28px 36px' }}>{children}</section>
    </div>
  );
}
