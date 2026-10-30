// Used by the Notifications and Privacy pages: loads my saved switches and saves them again.
import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useUser } from '../UserContext.jsx';
import useLoad from './useLoad.js';

export default function useSettingsSection(sectionName) {
  const { runAction } = useUser();
  const [profile] = useLoad('/users/me', null);
  const [values, setValues] = useState(null);

  useEffect(() => {
    if (profile) setValues(profile.user.settings[sectionName]);
  }, [profile, sectionName]);

  function setValue(key, value) {
    setValues({ ...values, [key]: value });
  }

  function save(event) {
    event.preventDefault();
    runAction(() => api('/users/me/settings', { method: 'PUT', body: { [sectionName]: values } }), 'Saved');
  }

  return { values, setValue, save };
}
