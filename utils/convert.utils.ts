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

export const formatHistoryDate = (isoDateString: string) => {
  const currentDate = new Date();
  const date = new Date(isoDateString);
  const timeDifference = currentDate.getTime() - date.getTime();
  const secondsDifference = Math.floor(timeDifference / 1000);
  const minutesDifference = Math.floor(secondsDifference / 60);
  const hoursDifference = Math.floor(minutesDifference / 60);
  const daysDifference = Math.floor(hoursDifference / 24);

  if (secondsDifference < 60) {
    return "Last minute ago";
  } else if (minutesDifference < 60) {
    return `${minutesDifference} minute${minutesDifference > 1 ? "s" : ""} ago`;
  } else if (hoursDifference < 24) {
    return `${hoursDifference} hour${hoursDifference > 1 ? "s" : ""} ago`;
  } else if (daysDifference === 1) {
    return "Yesterday";
  } else {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  }
};
