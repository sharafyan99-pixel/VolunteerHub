import useSettingsSection from '../hooks/useSettingsSection.js';
import SettingsLayout from '../components/SettingsLayout.jsx';
import { ToggleRow } from '../components/FormParts.jsx';

const visibilityOptions = [
  ['public', 'Public — visible to everyone', 'Organizations and other volunteers can find your profile.'],
  ['organizations', 'Organizations only', 'Only organizations can view your profile.'],
  ['private', 'Private — hidden from search', 'You can still apply to opportunities.']
];
const groups = [
  ['Contact Information Privacy', [
    ['showEmail', 'Show email address', 'Organizations can see your email'],
    ['showPhone', 'Show phone number', 'Organizations can see your phone'],
    ['showLinkedin', 'Show LinkedIn profile', 'Display your LinkedIn link on your profile'],
    ['showBirthDate', 'Show date of birth', 'Show your birth date on your profile']]],
  ['Activity & Stats Visibility', [
    ['showHours', 'Show total hours', 'Display your hours publicly'],
    ['showRating', 'Show rating', 'Display your star rating'],
    ['showReviews', 'Show received reviews', 'Reviews visible on your profile'],
    ['showCertificates', 'Show certificates', 'Earned certificates appear on your profile']]],
  ['Data & Personalization', [
    ['allowSuggestions', 'Suggest opportunities', 'We use your skills and categories to recommend work'],
    ['allowAnalytics', 'Anonymous analytics', 'No personal data shared']]]
];

export default function Privacy() {
  const { values, setValue, save } = useSettingsSection('privacy');
  if (!values) return <SettingsLayout>Loading...</SettingsLayout>;

  return (
    <SettingsLayout>
      <form onSubmit={save}>
        <h2>Profile Visibility</h2>
        {visibilityOptions.map(([value, title, text]) => (
          <label key={value} className="card" style={{ display: 'block', margin: '8px 0' }}>
            <input type="radio" name="visibility" checked={values.visibility === value}
              onChange={() => setValue('visibility', value)} style={{ width: 'auto' }} /> <b>{title}</b><br /><small>{text}</small>
          </label>
        ))}
        {groups.map(([groupTitle, items]) => (
          <div key={groupTitle}>
            <h2>{groupTitle}</h2>
            {items.map(([key, title, text]) => (
              <ToggleRow key={key} title={title} text={text} checked={values[key]} onChange={value => setValue(key, value)} />
            ))}
          </div>
        ))}
        <button className="btn" style={{ marginTop: 12 }}>Save privacy settings</button>
      </form>
    </SettingsLayout>
  );
}
