let number;

function getRandNumber() {
  const x = Math.floor((Math.random() * 10) + 1);

  if (x === number) {
    return getRandNumber();
  }

  return x;
}

module.exports = () => {
  number = getRandNumber();

  return `'lunacreates:${number}'`;
}
