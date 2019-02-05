const fs2 = require('fs2');
const touch = require('touch');

function register(on, config) {
  on('task', {
    mkdir(newDir) {
      return new Promise(function(resolve, reject) {
        fs2.mkdir(newDir, {
          intermediate: true
        }, resolve);
      })
    },
    touch(path) {
      return new Promise(function(resolve, reject) {
        touch(path, null, resolve);
      });
    },
    rename({from, to}) {
      return new Promise(function(resolve, reject) {
        fs2.rename(from, to, resolve);
      });
    },
    unlink(path) {
      return new Promise(function(resolve, reject) {
        fs2.unlink(path, resolve);
      });
    }
  });
};

module.exports = {
  register
};