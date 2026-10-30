// The search box (keyword + city). It opens the Search page with the words in the address.
import { useNavigate } from 'react-router-dom';

export default function SearchForm({ keyword = '', city = '' }) {
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    const params = new URLSearchParams(new FormData(event.target));   // keyword=...&city=...
    navigate('/search?' + params);
  }

  return (
    <form className="search" key={keyword + city} onSubmit={handleSubmit}>
      <input name="keyword" defaultValue={keyword} placeholder="Search by keyword or organization" />
      <input name="city" defaultValue={city} placeholder="City" />
      <button className="btn">Search</button>
    </form>
  );
}
