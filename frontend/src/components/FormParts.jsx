// Small reusable pieces for forms.
import { useNavigate } from 'react-router-dom';

// A row with a title and an on/off switch
export function ToggleRow({ title, text, checked, onChange }) {
  return (
    <div className="row" style={{ padding: '8px 0', borderBottom: '1px solid #ddd' }}>
      <span><b>{title}</b><br /><small>{text}</small></span>
      <input type="checkbox" className="tog" checked={!!checked} onChange={event => onChange(event.target.checked)} />
    </div>
  );
}

// Grey labels like "Teaching"
export function Tags({ list }) {
  if (!list || list.length === 0) return <small>Nothing added yet</small>;
  return list.map(item => <span key={item} className="tag">{item}</span>);
}

export function SaveCancel({ saveText }) {
  const navigate = useNavigate();
  return (
    <p>
      <button className="btn">{saveText}</button>{' '}
      <button type="button" className="btn o" onClick={() => navigate(-1)}>Cancel</button>
    </p>
  );
}

// "Ani Sahakyan, Teaching" -> ['Ani Sahakyan', 'Teaching']
export function splitList(text) {
  return text.split(',').map(item => item.trim()).filter(item => item !== '');
}
