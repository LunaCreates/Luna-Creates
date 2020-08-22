module.exports = date => {
  const d = new Date(date);
  const year = d.getFullYear();
  let month = d.getMonth() + 1;
  let day = d.getDate();

  if (month.toString().length < 2) {
    month = `0${month}`;
  }

  if (day.toString().length < 2) {
    day = `0${day}`;
  }

  return [year, month, day].join('-');
}
