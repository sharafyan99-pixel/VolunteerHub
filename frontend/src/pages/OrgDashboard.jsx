import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useUser } from '../UserContext.jsx';
import useLoad from '../hooks/useLoad.js';
import DashboardLayout from '../components/DashboardLayout.jsx';
import DataTable from '../components/DataTable.jsx';

export default function OrgDashboard() {
  const { runAction } = useUser();
  const [profile] = useLoad('/users/me', null);
  const [applications, reloadApplications] = useLoad('/applications/received', []);
  if (!profile) return <DashboardLayout>Loading...</DashboardLayout>;

  const { user, stats } = profile;
  const pendingApplications = applications.filter(application => application.status === 'Pending');

  async function answer(applicationId, status) {
    const request = () => api('/applications/' + applicationId + '/status', { method: 'PUT', body: { status } });
    if (await runAction(request, 'Application ' + status.toLowerCase())) reloadApplications();
  }

  return (
    <DashboardLayout>
      <div className="row"><h2>Welcome, {user.name} 🌿</h2><Link className="btn or sm" to="/create">+ Post opportunity</Link></div>
      <div className="stats">
        <div className="stat"><b>{stats.activeListings}</b>Active Listings</div>
        <div className="stat"><b>{stats.volunteerCount}</b>Volunteers</div>
        <div className="stat"><b>{stats.totalHours}</b>Hours Logged</div>
        <div className="stat"><b>{stats.rating}</b>Rating</div>
      </div>

      <h3>New applicants</h3>
      {pendingApplications.length === 0 ? <p>No applicants are waiting for your answer.</p> : (
        <DataTable headers={['Name', 'Opportunity', 'Applied', 'Action']}
          rows={pendingApplications.map(a => [a.volunteerName, a.opportunityTitle, a.appliedAt, <>
            <button className="btn sm" onClick={() => answer(a.id, 'Approved')}>Approve</button>{' '}
            <button className="btn sm" style={{ background: '#8b1a1a' }} onClick={() => answer(a.id, 'Rejected')}>Reject</button></>])} />
      )}
    </DashboardLayout>
  );
}
