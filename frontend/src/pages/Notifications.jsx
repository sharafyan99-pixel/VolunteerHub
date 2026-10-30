import { api } from '../api.js';
import { useUser } from '../UserContext.jsx';
import useLoad from '../hooks/useLoad.js';
import DashboardLayout from '../components/DashboardLayout.jsx';

export default function Notifications() {
  const { runAction } = useUser();
  const [notifications, reloadNotifications] = useLoad('/notifications/mine', []);
  const hasUnread = notifications.some(notification => !notification.isRead);

  async function markAllAsRead() {
    if (await runAction(() => api('/notifications/read', { method: 'PUT' }))) reloadNotifications();
  }

  return (
    <DashboardLayout>
      <div className="row"><h2>Notifications</h2>
        {hasUnread && <button className="btn o sm" onClick={markAllAsRead}>Mark all as read</button>}</div>
      {notifications.length === 0 && <p>You have no notifications yet.</p>}
      {notifications.map(notification => (
        <div key={notification.id} className="note" style={notification.isRead ? { opacity: 0.6 } : {}}>
          <b>{notification.title}</b><br />{notification.text}<br /><small>{notification.date}</small>
        </div>
      ))}
    </DashboardLayout>
  );
}
