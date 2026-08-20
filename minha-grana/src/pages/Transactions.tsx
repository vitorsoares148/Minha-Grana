import { useState } from "react";
import Calendar from "../components/transactions/Calendar";
import TransactionManager from "../components/transactions/TransactionManager";

export default function Transactions() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  return (
    <div className="z-1 mt-24 flex flex-col items-center gap-7 pb-7 lg:flex-row">
      <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

      <TransactionManager selectedDate={selectedDate} />
    </div>
  );
}
