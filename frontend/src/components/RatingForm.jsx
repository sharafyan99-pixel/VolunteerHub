// Choose 1-5 stars and write a short comment, then press Send.
import { useState } from 'react';

export default function RatingForm({ title, onSubmit, onCancel }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(rating, comment);
  }

  return (
    <form className="card" onSubmit={handleSubmit} style={{ marginTop: 14 }}>
      <h3>{title}</h3>
      <label>Stars</label>
      <select className="field" value={rating} onChange={event => setRating(Number(event.target.value))}>
        {[5, 4, 3, 2, 1].map(stars => <option key={stars} value={stars}>{'⭐'.repeat(stars)} ({stars})</option>)}
      </select>
      <label>Comment (optional)</label>
      <textarea className="field" rows="3" value={comment} onChange={event => setComment(event.target.value)} />
      <p><button className="btn sm">Send review</button>{' '}
        <button type="button" className="btn o sm" onClick={onCancel}>Cancel</button></p>
    </form>
  );
}
