#! /usr/bin/env node

const Blink = require('blink-diff');
const path = require('path');
const argv = require('yargs').argv;

const resolve = (name) => {
  // NOTE: this assumes the script is being in the projects node_modules folder atm!
  return path.resolve(__dirname, `../../../cypress/screenshots/${name}`);
};

const threshold = argv.threshold ? parseFloat(argv.threshold) : 0.005;

const diff = new Blink({
  imageAPath: resolve(`${argv.name}.png`),
  imageBPath: resolve(`new/${argv.name}.png`),
  imageOutputPath: resolve(`diff/${argv.name}.png`),
  thresholdType: Blink.THRESHOLD_PERCENT,
  threshold
});

diff.run((error, result) => {
  console.log(diff.hasPassed(result.code) ? 'Yay' : 'Nah');
});
