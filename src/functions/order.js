exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body);
  const items = data.line_items[0].properties;

  console.log(items, 'order');
}
