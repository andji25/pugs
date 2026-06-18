import { useState, useEffect } from "react"
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
  const events = activities.map(activity => {
    const dateStr = activity.date.split('T')[0]
    const timeStr = activity.time ? activity.time.substring(0, 5) : null
    const start = timeStr ? new Date(`${dateStr}T${timeStr}`) : new Date(dateStr)
    const end = timeStr 
      ? new Date(new Date(`${dateStr}T${timeStr}`).getTime() + 60 * 60 * 1000)
      : new Date(dateStr)
  
    return {
      id: activity.id,
      title: activity.name,
      start: start,
      end: end,
      resource: activity
    }
  })

  const [currentDate, setCurrentDate] = useState(
    events.length > 0 ? events[0].start : new Date()
  )
  const [currentView, setCurrentView] = useState('month')

  return (
    <div className="bg-white/80 rounded-xl p-4 border border-sky-200">
      <div style={{ height: 500 }} onClick={(e) => e.stopPropagation()}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          view={currentView}
          onView={(view) => setCurrentView(view)}
        />
      </div>
    </div>
  )
}

export default CalendarView