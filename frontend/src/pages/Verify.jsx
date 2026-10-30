import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api.js';

export default function Verify() {
  const [searchParams] = useSearchParams();
  const [number, setNumber] = useState(searchParams.get('number') || '');
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState('');

  async function checkCertificate(event) {
    if (event) event.preventDefault();
    setCertificate(null);
    setError('');
    try {
      setCertificate(await api('/certificates/verify/' + encodeURIComponent(number.trim())));
    } catch (problem) {
      setError(problem.message);
    }
  }

  useEffect(() => { if (number) checkCertificate(); }, []);   // opened from a "Share" link

  return (
    <div className="wrap" style={{ maxWidth: 640, textAlign: 'center' }}>
      <h2>Certificate Verification</h2>
      <p>Check that a VolunteerHub Armenia certificate is real</p>
      <form className="card" style={{ textAlign: 'left' }} onSubmit={checkCertificate}>
        <label>Certificate number</label>
        <input className="field" value={number} onChange={event => setNumber(event.target.value)} placeholder="CERT-2026-K7P3QX" required />
        <button className="btn" style={{ width: '100%', marginTop: 10 }}>Verify Certificate</button>
      </form>

      {certificate && (
        <div className="card" style={{ marginTop: 16, textAlign: 'left', borderColor: 'var(--g)' }}>
          <h3>✅ Certificate Verified</h3>
          <p>Number: {certificate.number}<br />Volunteer: {certificate.volunteerName}<br />Organization: {certificate.organizationName}<br />
            Opportunity: {certificate.title}<br />Hours: {certificate.hours}<br />Issued: {certificate.issuedAt}</p>
        </div>
      )}
      {error && <p style={{ color: '#b00' }}>{error}</p>}
    </div>
  );
}
