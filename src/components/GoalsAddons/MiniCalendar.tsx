import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import default styles
import "./MiniCalender.css"; // Custom styles

// Define types for Calendar component
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const MiniCalendar = () => {
  const [date, setDate] = useState<Value>(new Date());

  return (
    <div className="mini-calendar">
      <Calendar
        value={date}
        onChange={setDate as (value: Value) => void}
        className="custom-calendar dark:!bg-gray-900"
        tileClassName={({ date }: { date: Date }) => {
          const today = new Date();
          if (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
          ) {
            return "today-circle";
          }
          if (date.getDay() === 5) return "red-day"; // Fridays
          return "blue-day";
        }}
        // Format header to show only the month
        formatMonthYear={(locale, date) =>
          date.toLocaleDateString(locale, { month: "long" })
        }
      />
    </div>
  );
};

export default MiniCalendar;
