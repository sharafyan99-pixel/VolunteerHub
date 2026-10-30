import { api } from '../api.js';
import { useUser } from '../UserContext.jsx';
import useLoad from '../hooks/useLoad.js';
import DashboardLayout from '../components/DashboardLayout.jsx';
import DataTable from '../components/DataTable.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function Applicants() {
  const { runAction } = useUser();
  const [applications, reloadApplications] = useLoad('/applications/received', []);

  async function answer(applicationId, status) {
    const request = () => api('/applications/' + applicationId + '/status', { method: 'PUT', body: { status } });
    if (await runAction(request, 'Application ' + status.toLowerCase())) reloadApplications();
  }

  function renderAction(application) {
    if (application.status !== 'Pending') return '—';
    return <>
      <button className="btn sm" onClick={() => answer(application.id, 'Approved')}>Approve</button>{' '}
      <button className="btn sm" style={{ background: '#8b1a1a' }} onClick={() => answer(application.id, 'Rejected')}>Reject</button>
    </>;
  }

  return (
    <DashboardLayout>
      <h2>Applicants</h2>
      {applications.length === 0 ? <p>No one has applied to your opportunities yet.</p> : (
        <DataTable headers={['Name', 'Opportunity', 'Applied', 'Status', 'Action']}
          rows={applications.map(a => [a.volunteerName, a.opportunityTitle, a.appliedAt, <StatusBadge status={a.status} />, renderAction(a)])} />
      )}
    </DashboardLayout>
  );
}
