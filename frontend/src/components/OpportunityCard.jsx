// One opportunity card (used on Home, Search and the organization profile).
import { Link } from 'react-router-dom';

export default function OpportunityCard({ opportunity }) {
  return (
    <article className="card">
      <div className="cat">{opportunity.category}</div>
      <h3>{opportunity.title}</h3>
      <div>{opportunity.organizationName}</div>
      <div>
        <span className="tag">📍 {opportunity.city}</span>
        {opportunity.status === 'closed' && <span className="tag">Closed</span>}
      </div>
      <div className="row">
        <span>📅 {opportunity.dates}</span>
        <Link className="btn sm" to={'/opp/' + opportunity.id}>View details</Link>
      </div>
    </article>
  );
}
