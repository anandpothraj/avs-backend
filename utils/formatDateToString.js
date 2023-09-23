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
  };
  return inputDateObject.toLocaleString('en-US', options);
}