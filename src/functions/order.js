const fetch = require('node-fetch');

function containsMap(item) {
  return item.name === 'map';
}

function buildData(item) {
  return {
    name: 'map',
    value: JSON.parse(item.value)
  }
}

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body);
  const items = data.line_items;
  const isMap = items.some(item => item.properties.some(containsMap));

  if (isMap) {
    const data = items.map(item => item.properties.map(buildData));
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
