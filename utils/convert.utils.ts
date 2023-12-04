export const formatDate = (dateStr: string) => {
  const dateObject = new Date(dateStr);

  // Define options for formatting the date
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // Convert the date to the desired format
  const formattedDate = dateObject.toLocaleDateString("en-US", options);

  return formattedDate;
};
