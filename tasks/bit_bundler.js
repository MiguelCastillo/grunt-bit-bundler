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
    var settings = Object.assign({ files: [] }, this.options(), this.data);
    var files = this.files && this.files.length ? this.files : settings.files;
    var done = this.async();

    if (settings.Bitbundler) {
      Bitbundler = settings.Bitbundler;
    }

    try {
      files.forEach(function(file) {
        var bundler = Bitbundler.bundle({
          src: file.src,
          dest: file.dest
        }, settings);

        if (!settings.watch) {
          bundler.then(function() {
            done();
          }, function(err) {
            done(err);
          });
        }
      });
    }
    catch(err) {
      logError(err);
    }
  });
};
