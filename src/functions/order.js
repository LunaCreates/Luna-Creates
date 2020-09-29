const fetch = require('node-fetch');

function containsMap(item) {
  return item.name === 'Type';
}


function buildData(item) {
  return item.properties.reduce((obj, item) => (obj[item.name.toLowerCase()] = item.value, obj), {});
}

function formatLabels(item) {
  const property = item.split(' - ');

  return { color: property[0], title: property[1] };
}

function formatData(item) {
  item.lables = item.pins.split(', ').map(formatLabels);;
  item.frameSize = item.size;

  delete item.pins;
  delete item.size;

  return item;
}

function formatResultData(item) {
  return { properties: [{ name: 'map', value: { ...item } }] };
}

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body);
  const items = data.line_items;
  const isMap = items.some(item => item.properties.some(containsMap));

  if (isMap) {
    const mapData = items.map(buildData);
    const formattedMapData = mapData.map(formatData);
    const result = formattedMapData.map(formatResultData);
    const body = { line_items: result };

    console.log(JSON.stringify(body), 'body');

    await fetch('https://api.pinmaps.co.uk/generate', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(body)
    })
      .catch(error => console.error(error))
  }
}
