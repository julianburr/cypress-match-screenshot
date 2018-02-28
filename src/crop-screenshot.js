#! /usr/bin/env node

const path = require('path');
const argv = require('yargs').argv;
const sizeOf = require('image-size');
const jimp = require('jimp');

const resolve = (filePath) => {
  return path.resolve(__dirname, `../../../${filePath}`);
};

sizeOf(resolve(argv.path), (error, dimensions) => {
  jimp.read(resolve(argv.path), (imgError, img) => {
    const scale = dimensions.width / parseInt(argv.windowWidth);
    img.crop(
      parseInt(argv.left) * scale,
      parseInt(argv.top) * scale,
      parseInt(argv.width) * scale,
      parseInt(argv.height) * scale
    );
    img.resize(argv.testWidth, jimp.AUTO);
    img.write(resolve(argv.path));
  });
});
