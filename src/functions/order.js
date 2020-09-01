const fetch = require('node-fetch');

function containsMap(item) {
  return item.name === 'map';
}

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body);
  const items = data.line_items;
  const isMap = items.some(item => item.properties.some(containsMap));

  console.log(isMap, 'isMap');

  if (isMap) {
    const data = items.map(item => item.properties.map(item => JSON.parse(item.value)));
    const result = JSON.stringify({ line_items: [{ properties: data }] });

    console.log(result, 'data');

    await fetch('https://api.pinmaps.co.uk/generate', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: result
    })
    .catch(error => console.error(error))
  }
}
