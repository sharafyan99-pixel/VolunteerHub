import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useUser } from '../UserContext.jsx';
import DashboardLayout from '../components/DashboardLayout.jsx';
import FormField from '../components/FormField.jsx';
import { CATEGORIES, CITIES } from '../data/constants.js';

export default function CreateOpportunity() {
  const navigate = useNavigate();
  const { runAction } = useUser();
  const [form, setForm] = useState({ title: '', category: '', city: '', description: '', startDate: '', endDate: '', maxVolunteers: 0 });

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (await runAction(() => api('/opportunities', { method: 'POST', body: form }), 'Opportunity published')) {
      navigate('/manage');
    }
  }

  return (
    <DashboardLayout>
      <form className="form" onSubmit={handleSubmit} style={{ maxWidth: 700, borderRadius: 12 }}>
        <h2>Create New Opportunity</h2>
        <FormField label="Title *" name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Dilijan Forest Clean-Up Drive" />
        <div className="two">
          <div>
            <label>Category *</label>
            <select name="category" value={form.category} onChange={handleChange} required>
              <option value="" disabled>Choose category</option>
              {CATEGORIES.map(category => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>
          <div>
            <label>City *</label>
            <select name="city" value={form.city} onChange={handleChange} required>
              <option value="" disabled>Choose city</option>
              {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
        </div>
        <div className="two">
          <FormField label="Start date *" name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
          <FormField label="End date" name="endDate" type="date" value={form.endDate} onChange={handleChange} />
        </div>
        <FormField label="Max volunteers (0 = unlimited)" name="maxVolunteers" type="number" value={form.maxVolunteers} onChange={handleChange} />
        <label>Description</label>
        <textarea name="description" rows="4" value={form.description} onChange={handleChange} placeholder="Describe the tasks, requirements, what volunteers will gain.." />
        <p><button className="btn">Publish Listing</button></p>
      </form>
    </DashboardLayout>
  );
}
