import { useState } from 'react';
import { api } from '../api.js';
import { useUser } from '../UserContext.jsx';
import useLoad from '../hooks/useLoad.js';
import DashboardLayout from '../components/DashboardLayout.jsx';
import DataTable from '../components/DataTable.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function Hours() {
  const { runAction } = useUser();
  const [hourLogs, reloadHourLogs] = useLoad('/hours/mine', []);
  const [applications] = useLoad('/applications/mine', []);
  const [form, setForm] = useState({ applicationId: '', hours: '', workDate: '' });

  const approvedApplications = applications.filter(application => application.status === 'Approved');
  const sumHours = status => hourLogs.filter(log => log.status === status).reduce((sum, log) => sum + log.hours, 0);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (await runAction(() => api('/hours', { method: 'POST', body: form }), 'Hours sent for approval')) {
      setForm({ applicationId: '', hours: '', workDate: '' });
      reloadHourLogs();
    }
  }

  return (
    <DashboardLayout>
      <h2>Hour Log</h2>
      {hourLogs.length === 0 ? <p>You have not logged any hours yet.</p> : (
        <DataTable headers={['Activity', 'Date', 'Hours', 'Status']}
          rows={hourLogs.map(log => [log.activity, log.date, log.hours, <StatusBadge status={log.status} />])} />
      )}
      <div className="card" style={{ marginTop: 14 }}>
        Approved: <b>{sumHours('Approved')} hrs</b> &nbsp; Waiting for approval: <b>{sumHours('Pending')} hrs</b>
      </div>

      <form className="card" onSubmit={handleSubmit} style={{ marginTop: 14 }}>
        <h3>Log new hours</h3>
        {approvedApplications.length === 0 ? (
          <p>You can log hours after an organization approves your application.</p>
        ) : (
          <>
            <select className="field" name="applicationId" value={form.applicationId} onChange={handleChange} required>
              <option value="" disabled>Choose the volunteer work</option>
              {approvedApplications.map(a => <option key={a.id} value={a.id}>{a.opportunityTitle} - {a.organizationName}</option>)}
            </select>
            <div className="two" style={{ marginTop: 10 }}>
              <input className="field" name="hours" type="number" min="1" max="24" placeholder="Hours" value={form.hours} onChange={handleChange} required />
              <input className="field" name="workDate" type="date" value={form.workDate} onChange={handleChange} required />
            </div>
            <button className="btn" style={{ marginTop: 10 }}>Submit hours</button>
          </>
        )}
      </form>
    </DashboardLayout>
  );
}
