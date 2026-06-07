import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-US': enUS }
})

function CalendarView({ activities }) {
  const events = activities.map(activity => ({
    id: activity.id,
    title: activity.time ? `${activity.name} (${activity.time})` : activity.name,
    start: new Date(activity.date),
    end: new Date(activity.date),
    resource: activity
  }))

  return (
    <div className="bg-white/80 rounded-xl p-4 border border-sky-200">
      <div style={{ height: 500 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
        />
      </div>
    </div>
  )
}

export default CalendarView