import { useState, useEffect } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { addMonths, endOfMonth, subMonths } from "date-fns";

import { MONTHS } from "../../constants/months";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "../../utils/cn";

import Loading from "../generic/Loading";
import DateGrid from "../transactions/DateGrid";

interface CalendarProps {
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
}

const WEEK_DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

export default function Calendar({
  selectedDate,
  setSelectedDate,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { user, getUserInfoDate } = useAuth();
  const [loadingDate, setLoadingDate] = useState(true);

  function handleMonthChange(value: Date) {
    setCurrentDate(value);
  }

  useEffect(() => {
    async function handleDateChange() {
      await getUserInfoDate(currentDate.getMonth(), currentDate.getFullYear());

      const monthEnd = endOfMonth(currentDate);

      setSelectedDate((previousDate) => {
        const day = Math.min(previousDate.getDate(), monthEnd.getDate());

        return new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      });
      setLoadingDate(false);
    }

    handleDateChange();
  }, [currentDate, getUserInfoDate, setSelectedDate]);

  return (
    <div
      className={cn(
        "z-1 mx-auto",
        "h-170 w-170",
        "rounded-xl p-4",
        "border-2 border-white/8 shadow-md",
        "bg-linear-to-b from-neutral-900/60 to-neutral-900/80",
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between border-b-2 border-white/25 pb-4">
        <h2 className="pl-2 font-sans text-[36px] font-bold text-white">
          {MONTHS.find((month) => month.id === currentDate.getMonth())?.name}{" "}
          {currentDate.getFullYear()}
        </h2>

        <div className="flex gap-2">
          <MdKeyboardArrowLeft
            onClick={() => handleMonthChange(subMonths(currentDate, 1))}
            className="h-12 w-12 rounded-xl bg-white/6 text-white transition-all hover:bg-green-500"
          />

          <MdKeyboardArrowRight
            onClick={() => handleMonthChange(addMonths(currentDate, 1))}
            className="h-12 w-12 rounded-xl bg-white/6 text-white transition-all hover:bg-green-500"
          />
        </div>
      </div>

      {/* Grade Dias da Semana */}
      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[24px] font-bold text-white">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Grade Data */}
      {loadingDate ? (
        <div className="mt-[25%]">
          <Loading />
        </div>
      ) : (
        <DateGrid
          currentDate={currentDate}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          user={user}
        />
      )}
    </div>
  );
}
