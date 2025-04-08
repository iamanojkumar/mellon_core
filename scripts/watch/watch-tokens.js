const chokidar = require('chokidar');
const { validateAndTransform } = require('../csv-validation/process-csv');
const { exec } = require('child_process');

// Watch CSV files
const watcher = chokidar.watch('tokens/csv/*.csv', {
  ignored: /(^|[\/\\])\../,
  persistent: true
});

// Process CSV and run Style Dictionary on changes
const handleChange = (path) => {
  console.log(`File ${path} has been changed`);
  validateAndTransform(path)
    .then(() => {
      exec('npx style-dictionary build', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        if (stderr) console.error(`stderr: ${stderr}`);
      });
    })
    .catch(error => console.error('Error processing file:', error));
};

watcher
  .on('add', handleChange)
  .on('change', handleChange)
  .on('unlink', path => console.log(`File ${path} has been removed`));

console.log('Watching for CSV changes...'); 