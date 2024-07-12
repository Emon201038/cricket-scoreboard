export function formatDate(dateString) {
  const date = new Date(dateString);
  // Array of weekday names and month names
  let weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get weekday and month from date object
  let weekday = weekdays[date.getUTCDay()];
  let month = months[date.getUTCMonth()];
  let day = date.getUTCDate();

  // Construct formatted date string
  let formatted = `${weekday}, ${month} ${day}`;

  return formatted;
}

export function getOrdinalSuffix(number) {
  // Convert number to string
  const str = number.toString();
  // Get the last two digits for the special cases like 11th, 12th, 13th
  const lastTwoDigits = parseInt(str.slice(-2));
  // Get the last digit for the general case
  const lastDigit = parseInt(str.slice(-1));

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return number + "th" + ": ";
  }

  switch (lastDigit) {
    case 1:
      return number + "st" + ": ";
    case 2:
      return number + "nd" + ": ";
    case 3:
      return number + "rd" + ": ";
    default:
      return number + "th" + ": ";
  }
}
