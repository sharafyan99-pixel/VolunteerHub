// Step 1: issue a certificate (the volunteer work becomes "Completed").
// Step 2: rate the volunteer - this changes the volunteer's rating.
import { useState } from 'react';
import { api } from '../api.js';
import { useUser } from '../UserContext.jsx';
import useLoad from '../hooks/useLoad.js';
import DashboardLayout from '../components/DashboardLayout.jsx';
import DataTable from '../components/DataTable.jsx';
import RatingForm from '../components/RatingForm.jsx';

export default function IssueCertificates() {
  const { runAction } = useUser();
  const [readyApplications, reloadReady] = useLoad('/certificates/issuable', []);
  const [allApplications, reloadAll] = useLoad('/applications/received', []);
  const [applicationToRate, setApplicationToRate] = useState(null);

  const waitingForRating = allApplications.filter(a => a.status === 'Completed' && !a.reviewedByMe);

  async function issue(applicationId) {
    if (await runAction(() => api('/certificates', { method: 'POST', body: { applicationId } }), 'Certificate issued')) {
      reloadReady();
      reloadAll();
    }
  }

  async function sendReview(rating, comment) {
    const body = { applicationId: applicationToRate.id, rating, comment };
    if (await runAction(() => api('/reviews', { method: 'POST', body }), 'Review saved')) {
      setApplicationToRate(null);
      reloadAll();
    }
  }

  return (
    <DashboardLayout>
      <h2>Issue certificates</h2>
      {readyApplications.length === 0 ? <p>No volunteers are ready for a certificate. A volunteer needs approved hours first.</p> : (
        <DataTable headers={['Volunteer', 'Opportunity', 'Approved hours', 'Action']}
          rows={readyApplications.map(a => [a.volunteerName, a.opportunityTitle, a.approvedHours,
            <button className="btn sm" onClick={() => issue(a.id)}>Issue certificate</button>])} />
      )}

      <h2 style={{ marginTop: 28 }}>Rate volunteers</h2>
      {waitingForRating.length === 0 ? <p>No completed volunteers are waiting for your rating.</p> : (
        <DataTable headers={['Volunteer', 'Opportunity', 'Hours', 'Action']}
          rows={waitingForRating.map(a => [a.volunteerName, a.opportunityTitle, a.approvedHours,
            <button className="btn o sm" onClick={() => setApplicationToRate(a)}>Rate volunteer</button>])} />
      )}
      {applicationToRate && (
        <RatingForm title={'Rate ' + applicationToRate.volunteerName} onSubmit={sendReview} onCancel={() => setApplicationToRate(null)} />
      )}
    </DashboardLayout>
  );
}
