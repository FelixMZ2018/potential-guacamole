const fs = require('fs');

const defaultValues = {
  mqtt: {
    host: null,
    port: null,
  },
  selectedFCTGraph: null,
  savedFctGraphs: [],
};

const json = JSON.stringify(defaultValues);
fs.writeFile('./src/config.json', JSON.stringify(json, null, 4), (err) => {
  if (err) { console.error(err); return; }
  console.log('File has been created');
});
