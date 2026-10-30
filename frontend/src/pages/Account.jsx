// Edit my profile. Everything shown here comes from my real account.
import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useUser } from '../UserContext.jsx';
import useLoad from '../hooks/useLoad.js';
import SettingsLayout from '../components/SettingsLayout.jsx';
import FormField from '../components/FormField.jsx';
import { SaveCancel, splitList } from '../components/FormParts.jsx';
import { CITIES } from '../data/constants.js';

export default function Account() {
  const { user, runAction } = useUser();
  const [profile] = useLoad('/users/me', null);
  const [form, setForm] = useState(null);
  const isOrg = user.role === 'organization';

  useEffect(() => {
    if (!profile) return;
    const saved = profile.user;
    // lists are shown as text separated by commas:  "Teaching, First Aid"
    setForm({ ...saved, skills: saved.skills.join(', '), interests: saved.interests.join(', '), availability: saved.availability.join(', ') });
  }, [profile]);

  if (!form) return <SettingsLayout>Loading...</SettingsLayout>;

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const body = isOrg ? form : {
      ...form, skills: splitList(form.skills), interests: splitList(form.interests), availability: splitList(form.availability)
    };
    runAction(() => api('/users/me', { method: 'PUT', body }), 'Profile saved');
  }

  return (
    <SettingsLayout>
      <form onSubmit={handleSubmit}>
        <h2>{isOrg ? 'Organization information' : 'Personal information'}</h2>
        {isOrg ? (
          <>
            <FormField label="Organization name" name="organizationName" value={form.organizationName} onChange={handleChange} required />
            <div className="two">
              <FormField label="Contact person's job title" name="jobTitle" value={form.jobTitle} onChange={handleChange} />
              <FormField label="Founded (year)" name="foundedYear" type="number" value={form.foundedYear} onChange={handleChange} />
            </div>
          </>
        ) : (
          <div className="two">
            <FormField label="First name" name="firstName" value={form.firstName} onChange={handleChange} required />
            <FormField label="Last name" name="lastName" value={form.lastName} onChange={handleChange} required />
          </div>
        )}

        <div className="two">
          <FormField label="Email (cannot be changed)" name="email" type="email" value={form.email} readOnly />
          <FormField label="Phone number" name="phone" value={form.phone} onChange={handleChange} />
        </div>

        <div className="two">
          <div>
            <label>City</label>
            <select name="city" value={form.city || ''} onChange={handleChange}>
              {!isOrg && <option value="">Not specified</option>}
              {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
          {isOrg
            ? <FormField label="Website" name="website" value={form.website} onChange={handleChange} placeholder="https://" />
            : <FormField label="Date of birth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} />}
        </div>

        {isOrg ? (
          <>
            <label>About the organization</label>
            <textarea name="description" rows="4" value={form.description} onChange={handleChange} />
          </>
        ) : (
          <>
            <label>Short bio</label>
            <textarea name="bio" rows="3" value={form.bio} onChange={handleChange} />
            <FormField label="LinkedIn profile URL" name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
            <h2>Skills &amp; Interests</h2>
            <FormField label="Skills (separate with commas)" name="skills" value={form.skills} onChange={handleChange} placeholder="Teaching, First Aid" />
            <FormField label="Preferred categories (commas)" name="interests" value={form.interests} onChange={handleChange} placeholder="Education, Environment" />
            <FormField label="Availability (commas)" name="availability" value={form.availability} onChange={handleChange} placeholder="Weekends, Weekday evenings" />
          </>
        )}
        <SaveCancel saveText="Save changes" />
      </form>
    </SettingsLayout>
  );
}
