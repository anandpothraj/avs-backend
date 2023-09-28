module.exports = (inputDate) => {
  const inputDateObject = new Date(inputDate);

  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  };

  const formattedDate = inputDateObject.toLocaleString('en-US', options);
  const cleanedDate = formattedDate.replace(/ GMT[+-]\d{1,2}:\d{2}$/, '');
  return cleanedDate;
}