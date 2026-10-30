import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useUser } from '../UserContext.jsx';
import useLoad from '../hooks/useLoad.js';
import DashboardLayout from '../components/DashboardLayout.jsx';
import DataTable from '../components/DataTable.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import RatingForm from '../components/RatingForm.jsx';

export default function Applications() {
  const { runAction } = useUser();
  const [applications, reloadApplications] = useLoad('/applications/mine', []);
  const [applicationToRate, setApplicationToRate] = useState(null);

  async function withdraw(applicationId) {
    if (await runAction(() => api('/applications/' + applicationId, { method: 'DELETE' }), 'Application withdrawn')) {
      reloadApplications();
    }
  }

  async function sendReview(rating, comment) {
    const body = { applicationId: applicationToRate.id, rating, comment };
    if (await runAction(() => api('/reviews', { method: 'POST', body }), 'Thank you for your review')) {
      setApplicationToRate(null);
      reloadApplications();
    }
  }

  function renderActions(application) {
    if (application.status === 'Pending') {
      return <button className="btn o sm" onClick={() => withdraw(application.id)}>Withdraw</button>;
    }
    if (application.status === 'Approved') {
      return <Link className="btn sm" to="/hours">Log Hours</Link>;
    }
    if (application.status === 'Completed' && !application.reviewedByMe) {
      return <button className="btn o sm" onClick={() => setApplicationToRate(application)}>Rate organization</button>;
    }
    return '—';
  }

  return (
    <DashboardLayout>
      <h2>My applications</h2>
      {applications.length === 0 ? (
        <p>You have not applied yet. <Link to="/search"><b>Find opportunities</b></Link></p>
      ) : (
        <DataTable headers={['Opportunity', 'Organization', 'Applied', 'Status', 'Actions']}
          rows={applications.map(a => [a.opportunityTitle, a.organizationName, a.appliedAt, <StatusBadge status={a.status} />, renderActions(a)])} />
      )}
      {applicationToRate && (
        <RatingForm title={'Rate ' + applicationToRate.organizationName} onSubmit={sendReview} onCancel={() => setApplicationToRate(null)} />
      )}
    </DashboardLayout>
  );
}
