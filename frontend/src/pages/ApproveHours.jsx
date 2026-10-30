import { api } from '../api.js';
import { useUser } from '../UserContext.jsx';
import useLoad from '../hooks/useLoad.js';
import DashboardLayout from '../components/DashboardLayout.jsx';
import DataTable from '../components/DataTable.jsx';

export default function ApproveHours() {
  const { runAction } = useUser();
  const [hourLogs, reloadHourLogs] = useLoad('/hours/pending', []);

  async function answer(hourLogId, status) {
    const request = () => api('/hours/' + hourLogId + '/status', { method: 'PUT', body: { status } });
    if (await runAction(request, 'Hours ' + status.toLowerCase())) reloadHourLogs();
  }

  return (
    <DashboardLayout>
      <h2>Approve hours <span className="st Pending">{hourLogs.length} pending</span></h2>
      {hourLogs.length === 0 ? <p>No hours are waiting for approval.</p> : (
        <DataTable headers={['Volunteer', 'Opportunity', 'Date', 'Hours', 'Action']}
          rows={hourLogs.map(log => [log.volunteerName, log.activity, log.date, log.hours, <>
            <button className="btn sm" onClick={() => answer(log.id, 'Approved')}>Approve</button>{' '}
            <button className="btn sm" style={{ background: '#c33' }} onClick={() => answer(log.id, 'Rejected')}>Reject</button></>])} />
      )}
    </DashboardLayout>
  );
}
