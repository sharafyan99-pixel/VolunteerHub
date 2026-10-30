import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useUser } from '../UserContext.jsx';
import useLoad from '../hooks/useLoad.js';

export default function Opportunity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, runAction } = useUser();
  const [opportunity] = useLoad('/opportunities/' + id, null);

  if (!opportunity) return <div className="wrap">Loading...</div>;

  async function handleApply() {
    if (!user) {
      navigate('/login');
      return;
    }
    const worked = await runAction(
      () => api('/applications', { method: 'POST', body: { opportunityId: opportunity.id } }),
      'Application sent'
    );
    if (worked) navigate('/apps');
  }

  const canApply = !user || user.role === 'volunteer';

  return (
    <div className="wrap">
      <Link to="/search" className="btn o sm">← Back to Search</Link>
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div>
          <div className="cat">{opportunity.category}</div>
          <h1 style={{ margin: '4px 0' }}>{opportunity.title}</h1>
          <div>{opportunity.organizationName} · 📍 {opportunity.city} · 📅 {opportunity.dates}</div>
          <div style={{ marginTop: 8 }}>
            <span className={'tag ' + (opportunity.status === 'open' ? 'ok' : '')}>{opportunity.status === 'open' ? 'Open' : 'Closed'}</span>
            {opportunity.maxVolunteers > 0 && <span className="tag">Up to {opportunity.maxVolunteers} volunteers</span>}
          </div>
        </div>
        {canApply && <button className="btn" disabled={opportunity.status !== 'open'} onClick={handleApply}>Apply now</button>}
      </div>

      <h2>About this opportunity</h2>
      <p>{opportunity.description || 'The organization has not added a description.'}</p>
    </div>
  );
}
