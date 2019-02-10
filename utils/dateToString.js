const dateToString = date => {
  let month = date.getMonth() + 1;
  let dayOfMonth = date.getDate();
  const year = date.getFullYear();
  if (month < 10) {
    month = "0" + month;
  }
  if (date < 10) {
    dayOfMonth = "0" + date;
  }
  return `${month}/${dayOfMonth}/${year}`;
};

module.exports = dateToString;
