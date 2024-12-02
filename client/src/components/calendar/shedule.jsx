import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Configurer le localisateur pour React Big Calendar
const localizer = momentLocalizer(moment);

export default function StaticCalendar() {
  // Données statiques pour les événements
  const events = [
    {
      id: 1,
      title: 'Dose: 50mg',
      start: new Date(2024, 10, 21, 9, 0), // 21 Nov 2024, 9:00 AM
      end: new Date(2024, 10, 21, 9, 30), // 21 Nov 2024, 9:30 AM
    },
    {
      id: 2,
      title: 'Dose: 100mg',
      start: new Date(2024, 10, 22, 9, 0), // 22 Nov 2024, 9:00 AM
      end: new Date(2024, 10, 22, 9, 30), // 22 Nov 2024, 9:30 AM
    },
    {
      id: 3,
      title: 'Dose: 75mg',
      start: new Date(2024, 10, 23, 9, 0), // 23 Nov 2024, 9:00 AM
      end: new Date(2024, 10, 23, 9, 30), // 23 Nov 2024, 9:30 AM
    },
    {
      id: 4,
      title: 'Analysis Scheduled',
      start: new Date(2024, 10, 25, 14, 0), // 25 Nov 2024, 2:00 PM
      end: new Date(2024, 10, 25, 15, 0), // 25 Nov 2024, 3:00 PM
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Calendrier des Dosages</h1>
      <div className="bg-white rounded-lg shadow-lg p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          defaultView="month"
        />
      </div>
    </div>
  );
}
