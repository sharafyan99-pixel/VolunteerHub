import useSettingsSection from '../hooks/useSettingsSection.js';
import SettingsLayout from '../components/SettingsLayout.jsx';
import { ToggleRow } from '../components/FormParts.jsx';

const switches = [
  ['applicationStatus', 'Application status updates', 'When an application is approved or rejected'],
  ['hours', 'Hours approved / rejected', 'When an organization reviews your hours'],
  ['certificate', 'Certificate issued', 'When a new certificate is ready'],
  ['review', 'New review received', 'When someone writes a review about you'],
  ['eventReminders', 'Event reminders', 'A reminder before the work starts'],
  ['email', 'Email notifications', 'Receive all of the above by email too'],
  ['sms', 'SMS notifications', 'Text message alerts (additional charges may apply)']
];

export default function SettingsNotifications() {
  const { values, setValue, save } = useSettingsSection('notifications');
  if (!values) return <SettingsLayout>Loading...</SettingsLayout>;

  return (
    <SettingsLayout>
      <h2>Notification Preferences</h2>
      <form onSubmit={save}>
        {switches.map(([key, title, text]) => (
          <ToggleRow key={key} title={title} text={text} checked={values[key]} onChange={value => setValue(key, value)} />
        ))}
        <button className="btn" style={{ marginTop: 12 }}>Save Settings</button>
      </form>
    </SettingsLayout>
  );
}
