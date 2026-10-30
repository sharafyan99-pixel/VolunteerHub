import { Link } from 'react-router-dom';
import useLoad from '../hooks/useLoad.js';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { Tags } from '../components/FormParts.jsx';

export default function Profile() {
  const [profile] = useLoad('/users/me', null);
  if (!profile) return <DashboardLayout>Loading...</DashboardLayout>;

  const { user, stats } = profile;
  const sections = [['Skills', user.skills], ['Preferred categories', user.interests], ['Availability', user.availability]];

  return (
    <DashboardLayout>
      <h2 style={{ color: 'var(--g)' }}>{user.name}</h2>
      <p>Volunteer · {user.city ? user.city + ' · ' : ''}Member since {user.memberSince}</p>
      {user.bio && <p>{user.bio}</p>}
      <b>{stats.totalHours} hours · {stats.completedCount} completed · {user.rating}★ ({user.ratingCount} reviews) · {stats.certificateCount} certificates</b>
      {sections.map(([title, list]) => (
        <div key={title} className="card" style={{ marginTop: 12 }}><h3>{title}</h3><Tags list={list} /></div>
      ))}
      <p><Link className="btn sm" to="/account">Edit profile</Link></p>
    </DashboardLayout>
  );
}
