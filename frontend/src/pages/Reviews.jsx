import useLoad from '../hooks/useLoad.js';
import DashboardLayout from '../components/DashboardLayout.jsx';

export default function Reviews() {
  const [reviews] = useLoad('/reviews/received', []);

  return (
    <DashboardLayout>
      <h2>Reviews about me</h2>
      {reviews.length === 0 && <p>No one has reviewed you yet. Your rating is 0 until you get your first review.</p>}
      {reviews.map(review => (
        <div key={review.id} className="card" style={{ marginBottom: 10 }}>
          {'⭐'.repeat(review.rating)} <b>{review.fromName}</b> · {review.opportunityTitle}
          {review.comment && <p>"{review.comment}"</p>}
          <small>{review.date}</small>
        </div>
      ))}
    </DashboardLayout>
  );
}
