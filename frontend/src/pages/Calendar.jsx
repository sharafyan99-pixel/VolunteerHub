// Shows this month. Days with volunteer work you were approved for are underlined.
import { useState } from 'react';
import useLoad from '../hooks/useLoad.js';
import DashboardLayout from '../components/DashboardLayout.jsx';

export default function Calendar() {
  const [events] = useLoad('/calendar/mine', []);
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const emptyCellsBefore = new Date(year, month, 1).getDay();   // 0 = Sunday

  // "2026-10-05" for day number 5
  function dayText(day) {
    return year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
  }
  function eventsOnDay(day) {
    return events.filter(event => event.startDate <= dayText(day) && dayText(day) <= event.endDate);
  }

  const selectedEvents = eventsOnDay(selectedDay);

  return (
    <DashboardLayout>
      <h2>{today.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</h2>
      <div className="cal">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(name => <b key={name}>{name}</b>)}
        {Array.from({ length: emptyCellsBefore }, (_, i) => <span key={'empty' + i}></span>)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
          <span key={day} className={(eventsOnDay(day).length > 0 ? 'ev ' : '') + (day === selectedDay ? 'sel' : '')}
            onClick={() => setSelectedDay(day)}>{day}</span>
        ))}
      </div>

      <h3>{selectedDay} {today.toLocaleDateString('en-GB', { month: 'long' })} events</h3>
      {selectedEvents.length === 0 && <p>No volunteer work on this day.</p>}
      {selectedEvents.map(event => (
        <p key={event.id}>🟢 <b>{event.title}</b><br />{event.organizationName} · {event.city}</p>
      ))}
    </DashboardLayout>
  );
}
