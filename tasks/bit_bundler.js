/*
 * grunt-bitbundler
 * https://github.com/MiguelCastillo/bit-bundler
 *
 * Copyright (c) 2016 Miguel Castillo
 * Licensed under the MIT license.
 */

var Bitbundler = require("bit-bundler");

module.exports = function(grunt) {
  function logError(err) {
    var errStr = err && err.stack || err;
    grunt.log.error(errStr);
    return err;
  }

  grunt.task.registerMultiTask("bitbundler", "bit bundler grunt plugin", function() {
    var settings = this.data || {};
    var done = this.async();

    if (settings.Bitbundler) {
      Bitbundler = settings.Bitbundler;
    }

    try {
      this.files.forEach(function(file) {
        Bitbundler.bundle({
          src: file.src,
          dest: file.dest
        }, settings).then(function() {
          done();
        }, function(err) {
          done(err);
        });
      });
    }
    catch(err) {
      logError(err);
    }
  });
};
