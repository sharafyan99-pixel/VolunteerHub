import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useUser } from '../UserContext.jsx';
import useLoad from '../hooks/useLoad.js';
import DashboardLayout from '../components/DashboardLayout.jsx';
import DataTable from '../components/DataTable.jsx';

export default function ManageListings() {
  const { runAction } = useUser();
  const [opportunities, reloadOpportunities] = useLoad('/opportunities/mine', []);

  async function changeStatus(opportunityId, status) {
    const request = () => api('/opportunities/' + opportunityId + '/status', { method: 'PUT', body: { status } });
    if (await runAction(request, status === 'closed' ? 'Listing closed' : 'Listing reopened')) reloadOpportunities();
  }

  return (
    <DashboardLayout>
      <div className="row"><h2>Manage listings</h2><Link className="btn or sm" to="/create">+ Post opportunity</Link></div>
      {opportunities.length === 0 ? <p>You have not posted any opportunities yet.</p> : (
        <DataTable headers={['Title', 'Category', 'Dates', 'Status', 'Actions']}
          rows={opportunities.map(o => [o.title, o.category, o.dates, o.status === 'open' ? 'Open' : 'Closed',
            o.status === 'open'
              ? <button className="btn o sm" onClick={() => changeStatus(o.id, 'closed')}>Close</button>
              : <button className="btn sm" onClick={() => changeStatus(o.id, 'open')}>Reopen</button>])} />
      )}
    </DashboardLayout>
  );
}
