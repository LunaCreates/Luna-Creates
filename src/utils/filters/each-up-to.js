
module.exports = (ary, max, options) => {
  const result = [];

  for (let i = 0; i < max && i < ary.length; ++i) {
    result.push(options.fn(ary[i]));
  }

  return result.join('');
}
