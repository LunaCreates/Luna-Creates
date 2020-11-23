module.exports = date => {
  const d = new Date(date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };

  return d.toLocaleDateString('en-GB', options);
}
