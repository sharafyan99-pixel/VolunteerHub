import { Link } from 'react-router-dom';
import useLoad from '../hooks/useLoad.js';
import DashboardLayout from '../components/DashboardLayout.jsx';

export default function Certificates() {
  const [certificates] = useLoad('/certificates/mine', []);

  return (
    <DashboardLayout>
      <h2>My Certificates</h2>
      {certificates.length === 0 && <p>You have no certificates yet. An organization issues a certificate when your volunteer work is completed.</p>}
      {certificates.map(certificate => (
        <div key={certificate.id} className="card row" style={{ background: '#dff6ff', marginBottom: 10 }}>
          <div>
            <b>{certificate.title}</b><br />
            {certificate.organizationName} · {certificate.hours} hrs · {certificate.number} · {certificate.issuedAt}
          </div>
          <div>
            <button className="btn sm" onClick={() => window.print()}>Print / PDF</button>{' '}
            <Link className="btn o sm" to={'/verify?number=' + certificate.number}>Share</Link>
          </div>
        </div>
      ))}
    </DashboardLayout>
  );
}
