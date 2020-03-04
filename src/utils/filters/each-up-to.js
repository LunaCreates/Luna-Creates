
module.exports = (ary, max, options) => {
  const result = [];

  if (!ary || ary.length == 0) {
    return options.inverse(this);
  }

  for (let i = 0; i < max && i < ary.length; ++i) {
    result.push(options.fn(ary[i]));
  }

  return result.join('');
}
