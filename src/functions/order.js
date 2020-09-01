exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body);

  console.log(data, 'order');
}
