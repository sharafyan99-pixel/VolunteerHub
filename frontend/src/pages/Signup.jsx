// One signup page for both kinds of users:  /signup (volunteer)  and  /signup/org (organization)
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useUser } from '../UserContext.jsx';
import FormField, { PasswordField } from '../components/FormField.jsx';
import { CITIES } from '../data/constants.js';

export default function Signup({ isOrg }) {
  const navigate = useNavigate();
  const { login } = useUser();
  const [form, setForm] = useState({});
  const [agreed, setAgreed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    try {
      const role = isOrg ? 'organization' : 'volunteer';
      const body = { ...form, role };
      if (!isOrg) delete body.city;   // volunteers do not choose a city when signing up
      const data = await api('/auth/signup', { method: 'POST', body });
      login(data);
      navigate(isOrg ? '/org' : '/dash');
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <div className="split">
      <div className={'side ' + (isOrg ? 'org' : '')}>
        <span className="pill">{isOrg ? '🏢 For organization' : '🤝 Join as Volunteer'}</span>
        <h2>{isOrg ? 'Recruit dedicated volunteers' : 'Make a difference in Armenia'}</h2>
        <p>{isOrg ? 'Post opportunities and connect with motivated volunteers across Armenia.' : 'Create your free account and start volunteering today.'}</p>
        {/* <p>{isOrg ? 'Post opportunities and connect with motivated volunteers across Armenia.' : 'Create your free account and start volunteering today.'}</p> */}
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <h2 style={{ margin: 0 }}>{isOrg ? 'Register your organization' : 'Create Account'}</h2>
        <div className="tabs">
          <button type="button" className={isOrg ? '' : 'on'} onClick={() => navigate('/signup')}>🤝 Volunteer</button>
          <button type="button" className={isOrg ? 'on' : ''} onClick={() => navigate('/signup/org')}>🏢 Organization</button>
        </div>

        {isOrg ? (
          <>
            <FormField label="Organization name *" name="organizationName" value={form.organizationName} onChange={handleChange} required />
            <div className="two">
              <FormField label="Your job title *" name="jobTitle" value={form.jobTitle} onChange={handleChange} required />
              <FormField label="Founded (year)" name="foundedYear" type="number" value={form.foundedYear} onChange={handleChange} />
            </div>
          </>
        ) : (
          <div className="two">
            <FormField label="First name *" name="firstName" value={form.firstName} onChange={handleChange} required />
            <FormField label="Last name *" name="lastName" value={form.lastName} onChange={handleChange} required />
          </div>
        )}

        <div className="two">
          <FormField label="Email address *" name="email" type="email" value={form.email} onChange={handleChange} required />
          <FormField label="Phone" name="phone" type="tel" placeholder="+374" value={form.phone} onChange={handleChange} />
        </div>

        {isOrg && (
          <>
            <label>City *</label>
            <select name="city" value={form.city || ''} onChange={handleChange} required>
              <option value="" disabled>Select your city</option>
              {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
            </select>

            <label>About the organization</label>
            <textarea name="description" rows="3" value={form.description || ''} onChange={handleChange} placeholder="Mission and type of volunteers needed" />
          </>
        )}

        <div className="two">
          <PasswordField label="Password * (min 8 characters)" name="password" value={form.password} onChange={handleChange} required />
          <PasswordField label="Repeat password *" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
        </div>

        <label style={{ fontWeight: 400 }}>
          <input type="checkbox" checked={agreed} onChange={event => setAgreed(event.target.checked)} required style={{ width: 'auto' }} />
          {' '}I agree to Terms of Service &amp; Privacy Policy
        </label>

        {errorMessage && <p style={{ color: '#b00' }}>{errorMessage}</p>}
        <button className={'btn ' + (isOrg ? 'or' : '')} style={{ width: '100%', marginTop: 12, padding: 12 }}>
          {isOrg ? 'Create Organization Account' : 'Create Account'}
        </button>
        <p style={{ textAlign: 'center', fontSize: 13 }}>Already have an account? <Link to="/login"><b>Log In</b></Link></p>
      </form>
    </div>
  );
}
