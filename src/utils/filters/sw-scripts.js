const fs = require('fs');
const path = require('path');

module.exports = () => {
  const file = path.resolve(process.cwd(), 'src', 'cache-manifest.json');
  const contents = JSON.parse(fs.readFileSync(file, 'utf8'));
  const ScriptsPath = Object.values(contents).find(data => data.includes('common'));

  return `'/${ScriptsPath}'`;
}
