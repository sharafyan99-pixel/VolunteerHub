// Theme and font size are saved in this browser only.
import { useState } from 'react';
import { applyPreferences } from '../api.js';
import SettingsLayout from '../components/SettingsLayout.jsx';

export default function Appearance() {
  const [preferences, setPreferences] = useState({ theme: 'light', fontSize: 'medium', ...JSON.parse(localStorage.getItem('preferences') || '{}') });

  function choose(name, value) {
    const newPreferences = { ...preferences, [name]: value };
    setPreferences(newPreferences);
    localStorage.setItem('preferences', JSON.stringify(newPreferences));
    applyPreferences();   // changes the look of the page immediately
  }

  function Choice({ name, value, label }) {
    return <button type="button" className={'chip ' + (preferences[name] === value ? 'on' : '')} onClick={() => choose(name, value)}>{label}</button>;
  }

  return (
    <SettingsLayout>
      <h2>Theme</h2>
      <div className="chips">
        <Choice name="theme" value="light" label="Light" />
        <Choice name="theme" value="dark" label="Dark" />
        <Choice name="theme" value="system" label="System" />
      </div>
      <h2>Font Size</h2>
      <div className="chips">
        <Choice name="fontSize" value="small" label="Small" />
        <Choice name="fontSize" value="medium" label="Medium" />
        <Choice name="fontSize" value="large" label="Large" />
      </div>
      <small>Your choice is applied immediately and saved in this browser.</small>
    </SettingsLayout>
  );
}
