let number = 0;

function increment(n) {
  n++;

  return n;
}

module.exports = () => {
  const prod = process.env.NODE_ENV === 'prod';

  if (prod) {
    number = increment(number);

    return `'lunacreates:${number}'`;
  }

  return `'lunacreates:${Math.round(Math.random() * 10)}'`;
}
