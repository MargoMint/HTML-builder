const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin, stdout, exit } = require('process');

const filePath = path.join(__dirname, 'text.txt');

const writableStream = fs.createWriteStream(filePath, { flags: 'a' });

stdout.write('Welcome! Please enter text to save it to the file.\n');

stdin.on('data', (input) => {
  const newInput = input.toString().trim().toLowerCase();
  if (newInput === 'exit') {
    farewellAndExit();
  }
  writableStream.write(input);
});

process.on('SIGINT', farewellAndExit);

function farewellAndExit() {
  stdout.write('See you soon! Your input has been saved successfully.');
  writableStream.end();
  exit();
}