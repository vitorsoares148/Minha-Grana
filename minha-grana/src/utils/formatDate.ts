export const formatDate = (value: string) => {
  const [date] = value.split("T");
  const [, month, day] = date.split("-");

  return `${month}/${day}`;
};
