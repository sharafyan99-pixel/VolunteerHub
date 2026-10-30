import { useState } from 'react';
import { api } from '../api.js';
import { useUser } from '../UserContext.jsx';
import SettingsLayout from '../components/SettingsLayout.jsx';
import FormField from '../components/FormField.jsx';

const emptyForm = { currentPassword: '', newPassword: '', confirmNewPassword: '' };

export default function Security() {
  const { runAction } = useUser();
  const [form, setForm] = useState(emptyForm);
  const [errorMessage, setErrorMessage] = useState('');

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (form.newPassword.length < 8) return setErrorMessage('New password must be at least 8 characters.');
    if (form.newPassword !== form.confirmNewPassword) return setErrorMessage('New passwords do not match.');
    setErrorMessage('');
    if (await runAction(() => api('/auth/password', { method: 'PUT', body: form }), 'Password updated')) {
      setForm(emptyForm);
    }
  }

  return (
    <SettingsLayout>
      <form onSubmit={handleSubmit}>
        <h2>Change Password</h2>
        <FormField label="Current password" name="currentPassword" type="password" value={form.currentPassword} onChange={handleChange} required />
        <FormField label="New password (min 8 characters)" name="newPassword" type="password" value={form.newPassword} onChange={handleChange} required />
        <FormField label="Repeat new password" name="confirmNewPassword" type="password" value={form.confirmNewPassword} onChange={handleChange} required />
        <p style={{ color: '#b00' }}>{errorMessage}</p>
        <button className="btn o">Update password</button>
      </form>
    </SettingsLayout>
  );
}
