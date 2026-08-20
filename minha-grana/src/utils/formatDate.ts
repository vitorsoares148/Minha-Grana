export const formatDate = (value: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  }).format(value);
