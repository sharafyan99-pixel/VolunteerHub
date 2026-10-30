import { Link } from 'react-router-dom';
import useLoad from '../hooks/useLoad.js';
import DashboardLayout from '../components/DashboardLayout.jsx';
import DataTable from '../components/DataTable.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function Dashboard() {
  const [profile] = useLoad('/users/me', null);
  const [applications] = useLoad('/applications/mine', []);
  if (!profile) return <DashboardLayout>Loading...</DashboardLayout>;

  const { user, stats } = profile;
  const activeApplications = applications.filter(application => application.status === 'Pending' || application.status === 'Approved');

  return (
    <DashboardLayout>
      <h2>Welcome, {user.firstName} 👋</h2>
      <div className="stats">
        <div className="stat"><b>{stats.totalHours}</b>Total hours</div>
        <div className="stat"><b>{stats.completedCount}</b>Completed</div>
        <div className="stat"><b>{stats.certificateCount}</b>Certificates</div>
        <div className="stat"><b>{stats.rating}</b>Rating</div>
      </div>

      <h3>Active Registrations</h3>
      {activeApplications.length === 0 ? (
        <p>You have no active applications yet. <Link to="/search"><b>Find opportunities</b></Link></p>
      ) : (
        <DataTable headers={['Opportunity', 'Organization', 'Applied', 'Status']}
          rows={activeApplications.map(a => [a.opportunityTitle, a.organizationName, a.appliedAt, <StatusBadge status={a.status} />])} />
      )}
    </DashboardLayout>
  );
}
