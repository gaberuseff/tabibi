import { useState } from "react"
import { Input } from "./input"
import { Label } from "./label"

export default function SimpleDatePicker({ onDateChange, initialDate, error }) {
  // Initialize state with initialDate or current date
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date().toISOString().split('T')[0])
  
  // Convert initial hour from 24-hour to 12-hour format
  const initialHour24 = initialDate ? new Date(initialDate).getHours() : 9
  const initialHour12 = initialHour24 === 0 ? 12 : (initialHour24 > 12 ? initialHour24 - 12 : initialHour24)
  
  const [selectedHour, setSelectedHour] = useState(initialHour12)
  const [selectedMinute, setSelectedMinute] = useState(initialDate ? new Date(initialDate).getMinutes().toString().padStart(2, '0') : '00')
  const [timePeriod, setTimePeriod] = useState(initialDate ? (initialHour24 < 12 ? 'morning' : 'evening') : 'morning')

  // Generate hours (1-12 for 12-hour format)
  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  
  // Generate minutes (00, 15, 30, 45) - 15-minute intervals
  const minutes = ['00', '15', '30', '45']

  // Handle date change
  const handleDateChange = (e) => {
    const newDate = e.target.value
    setSelectedDate(newDate)
    // Combine date and time and notify parent
    const combinedDateTime = combineDateTime(newDate, selectedHour, selectedMinute, timePeriod)
    onDateChange(combinedDateTime)
  }

  // Handle hour change
  const handleHourChange = (e) => {
    const newHour = parseInt(e.target.value)
    setSelectedHour(newHour)
    // Combine date and time and notify parent
    const combinedDateTime = combineDateTime(selectedDate, newHour, selectedMinute, timePeriod)
    onDateChange(combinedDateTime)
  }

  // Handle minute change
  const handleMinuteChange = (e) => {
    const newMinute = e.target.value
    setSelectedMinute(newMinute)
    // Combine date and time and notify parent
    const combinedDateTime = combineDateTime(selectedDate, selectedHour, newMinute, timePeriod)
    onDateChange(combinedDateTime)
  }

  // Handle time period change (morning/evening)
  const handleTimePeriodChange = (period) => {
    setTimePeriod(period)
    
    // Combine date and time and notify parent
    const combinedDateTime = combineDateTime(selectedDate, selectedHour, selectedMinute, period)
    onDateChange(combinedDateTime)
  }

  // Combine date and time into ISO string (convert 12-hour to 24-hour for storage)
  const combineDateTime = (date, hour, minute, period) => {
    // Convert 12-hour format to 24-hour format
    let hour24 = hour
    
    if (period === 'morning') {
      // 12 AM is 00:00 in 24-hour format
      if (hour === 12) {
        hour24 = 0
      }
    } else {
      // PM hours (except 12 PM which stays 12)
      if (hour !== 12) {
        hour24 = hour + 12
      }
    }
    
    // Format hour to two digits
    const formattedHour = hour24.toString().padStart(2, '0')
    const formattedMinute = minute.toString().padStart(2, '0')
    
    return `${date}T${formattedHour}:${formattedMinute}:00`
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="simple-date">التاريخ *</Label>
        <Input
          id="simple-date"
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          min={new Date().toISOString().split('T')[0]} // Don't allow past dates
        />
      </div>
      
      <div className="space-y-2">
        <Label>الفترة الزمنية *</Label>
        <div className="flex gap-2">
          <button
            type="button"
            className={`flex-1 py-2 px-4 rounded-md border transition-colors ${
              timePeriod === 'morning' 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-muted border-border hover:bg-muted/80'
            }`}
            onClick={() => handleTimePeriodChange('morning')}
          >
            صباحاً
          </button>
          <button
            type="button"
            className={`flex-1 py-2 px-4 rounded-md border transition-colors ${
              timePeriod === 'evening' 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-muted border-border hover:bg-muted/80'
            }`}
            onClick={() => handleTimePeriodChange('evening')}
          >
            مساءً
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>الوقت *</Label>
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <select
              value={selectedHour}
              onChange={handleHourChange}
              className="flex h-10 w-full rounded-[var(--radius)] border border-border bg-background px-3 py-2 text-sm"
            >
              {hours.map(hour => (
                <option key={hour} value={hour}>{hour}</option>
              ))}
            </select>
          </div>
          <span className="text-muted-foreground">:</span>
          <div className="flex-1">
            <select
              value={selectedMinute}
              onChange={handleMinuteChange}
              className="flex h-10 w-full rounded-[var(--radius)] border border-border bg-background px-3 py-2 text-sm"
            >
              {minutes.map(minute => (
                <option key={minute} value={minute}>{minute}</option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          اختر الساعة والدقيقة من القوائم المنسدلة
        </p>
      </div>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}