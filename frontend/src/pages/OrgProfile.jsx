import useLoad from '../hooks/useLoad.js';
import DashboardLayout from '../components/DashboardLayout.jsx';
import OpportunityCard from '../components/OpportunityCard.jsx';

export default function OrgProfile() {
  const [profile] = useLoad('/users/me', null);
  const [opportunities] = useLoad('/opportunities/mine', []);
  const [reviews] = useLoad('/reviews/received', []);
  if (!profile) return <DashboardLayout>Loading...</DashboardLayout>;

  const { user, stats } = profile;

  return (
    <DashboardLayout>
      <div className="card" style={{ background: '#fde3d0' }}>
        <h2 style={{ margin: 0 }}>🌿 {user.name}</h2>
        {user.foundedYear && <>Est. {user.foundedYear} · </>}{user.city}<br />
        ⭐ {user.rating} ({user.ratingCount} reviews) · {stats.activeListings} active listings · {stats.volunteerCount} volunteers · {stats.totalHours} hrs logged
      </div>

      <h3>About</h3>
      <p>{user.description || 'No description yet. Add one in Settings → Account.'}</p>
      {user.website && <p>Website: {user.website}</p>}

      <h3>Opportunities</h3>
      {opportunities.length === 0 && <p>No opportunities posted yet.</p>}
      <div className="grid">{opportunities.map(o => <OpportunityCard key={o.id} opportunity={o} />)}</div>

      <h3>Reviews from volunteers</h3>
      {reviews.length === 0 && <p>No reviews yet.</p>}
      {reviews.map(review => (
        <div key={review.id} className="card" style={{ marginBottom: 10 }}>
          {'⭐'.repeat(review.rating)} <b>{review.fromName}</b>{review.comment && <p>"{review.comment}"</p>}
        </div>
      ))}
    </DashboardLayout>
  );
}
