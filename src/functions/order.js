const fetch = require('node-fetch');

function containsMap(item) {
  return item.name === 'map';
}

function buildPropertyData(item) {
  return {
    name: 'map',
    value: JSON.parse(item.value)
  }
}

function buildApiData(item) {
  return {
    properties: item.properties.map(buildPropertyData)
  }
}

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body);
  const items = data.line_items;
  const isMap = items.some(item => item.properties.some(containsMap));

  if (isMap) {
    const body = JSON.stringify({ line_items: items.map(buildApiData) });

    await fetch('https://api.pinmaps.co.uk/generate', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body
    })
      .catch(error => console.error(error))
  }
}
