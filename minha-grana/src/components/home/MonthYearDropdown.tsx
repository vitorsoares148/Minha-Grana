import { useEffect, useRef, useState } from "react";

import { useAuth } from "../../contexts/AuthContext";
import { MONTHS } from "../../constants/months";

import DateDropdown from "./DateDropdown";

export default function MonthYearDropdown({
  setLoadingInfo,
}: {
  setLoadingInfo: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(currentYear);
  const [openDropdown, setOpenDropdown] = useState<"month" | "year" | null>(
    null,
  );

  const { getUserInfoDate } = useAuth();

  const isMounted = useRef(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    async function handleUserInfoChange() {
      setLoadingInfo(true);
      await getUserInfoDate(month, year);
      setLoadingInfo(false);
    }

    handleUserInfoChange();
  }, [month, year]);

  const years = Array.from(
    { length: 11 },
    (_, index) => currentYear - 5 + index,
  );

  const yearOptions = years.map((item) => ({
    id: item,
    name: String(item),
  }));

  const selectedMonth = MONTHS.find((item) => item.id === month);

  return (
    <div ref={dropdownRef} className="flex">
      <DateDropdown
        value={selectedMonth?.name ?? ""}
        options={MONTHS}
        open={openDropdown === "month"}
        rounded="left"
        onToggle={() =>
          setOpenDropdown((current) => (current === "month" ? null : "month"))
        }
        onSelect={(value) => {
          setMonth(value);
          setOpenDropdown(null);
        }}
      />

      <DateDropdown
        value={String(year)}
        options={yearOptions}
        open={openDropdown === "year"}
        rounded="right"
        onToggle={() =>
          setOpenDropdown((current) => (current === "year" ? null : "year"))
        }
        onSelect={(value) => {
          setYear(value);
          setOpenDropdown(null);
        }}
      />
    </div>
  );
}
