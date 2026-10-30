import { useSearchParams } from 'react-router-dom';
import useLoad from '../hooks/useLoad.js';
import OpportunityCard from '../components/OpportunityCard.jsx';
import SearchForm from '../components/SearchForm.jsx';
import { CATEGORIES } from '../data/constants.js';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();   // the part of the address after "?"
  const [opportunities] = useLoad('/opportunities?' + searchParams.toString(), []);
  const selectedCategory = searchParams.get('category') || 'All';

  function changeParam(name, value) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(name, value);
    setSearchParams(newParams);
  }

  return (
    <>
      <section className="hero">
        <span className="pill">🌿 Find Opportunities</span>
        <h1>Find <b>Volunteering</b> Opportunities</h1>
        <p>Filter by category, city or keyword</p>
        <SearchForm keyword={searchParams.get('keyword') || ''} city={searchParams.get('city') || ''} />
      </section>

      <div className="wrap">
        <div className="chips">
          Category:
          {['All', ...CATEGORIES].map(category => (
            <button key={category} className={'chip ' + (category === selectedCategory ? 'on' : '')}
              onClick={() => changeParam('category', category)}>{category}</button>
          ))}
          <span style={{ marginLeft: 'auto' }}>
            Sort by:{' '}
            <select value={searchParams.get('sort') || ''} onChange={event => changeParam('sort', event.target.value)}>
              <option value="">Newest</option>
              <option value="az">A–Z</option>
            </select>
          </span>
        </div>

        <div className="grid">
          {opportunities.map(opportunity => <OpportunityCard key={opportunity.id} opportunity={opportunity} />)}
        </div>
        {opportunities.length === 0 && <p>No opportunities found. Try another category or keyword.</p>}
      </div>
    </>
  );
}
