export const formatDate = (value: string) => {
  const [, month, day] = value.split("-");

  return `${month}/${day}`;
};
