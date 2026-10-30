import { Link } from 'react-router-dom';
import useLoad from '../hooks/useLoad.js';
import OpportunityCard from '../components/OpportunityCard.jsx';
import SearchForm from '../components/SearchForm.jsx';

export default function Home() {
  const [opportunities] = useLoad('/opportunities', []);
  const latestThree = opportunities.slice(0, 3);

  return (
    <>
      <section className="hero">
        <span className="pill">🌿 Volunteer in Armenia</span>
        <h1>Find Volunteering <br />Opportunities Across Armenia</h1>
        <p>Connecting passionate volunteers with organizations that need them</p>
        <SearchForm />
      </section>

      <div className="wrap">
        <div className="grid">
          <div className="card feat"><span>🤝</span><h3>Find Opportunities</h3><p>Browse openings by category, city or date</p></div>
          <div className="card feat"><span>⏱️</span><h3>Track Your Hours</h3><p>Log hours and get them approved by the organization</p></div>
          <div className="card feat"><span>🏅</span><h3>Earn Certificates</h3><p>Get certificates with a number anyone can verify</p></div>
        </div>

        <h3 style={{ marginTop: 32 }}>Latest Opportunities</h3>
        {latestThree.length === 0 && <p>No opportunities have been posted yet.</p>}
        <div className="grid">
          {latestThree.map(opportunity => <OpportunityCard key={opportunity.id} opportunity={opportunity} />)}
        </div>
      </div>

      <section className="cta">
        <h2>Ready to make a difference?</h2>
        <p>Join 3,400+ volunteers across Armenia</p>
        <Link className="btn" to="/signup" style={{ background: '#3ecf7a' }}>I'm a Volunteer</Link>
        <Link className="btn o" to="/signup/org">Register Organization</Link>
      </section>
    </>
  );
}
