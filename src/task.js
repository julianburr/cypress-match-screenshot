const fs = require('fs');
const touch = require('touch');

function registerTask(on, config) {
  on('task', {
    mkdir(newDir) {
      return new Promise(function(resolve, reject) {
        fs.mkdir(newDir, resolve);
      })
    },
    touch(path) {
      return new Promise(function(resolve, reject) {
        touch(path, null, resolve);
      });
    },
    rename({from, to}) {
      return new Promise(function(resolve, reject) {
        fs.rename(from, to, resolve);
      });
    },
    unlink(path) {
      return new Promise(function(resolve, reject) {
        fs.unlink(path, resolve);
      });
    }
  });
};

module.exports = registerTask;