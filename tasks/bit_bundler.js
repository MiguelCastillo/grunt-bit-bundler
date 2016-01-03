/*
 * grunt-bitbundler
 * https://github.com/MiguelCastillo/bit-bundler
 *
 * Copyright (c) 2015 Miguel Castillo
 * Licensed under the MIT license.
 */

"use strict";


var utils = require("belty");
var types = require("dis-isa");
var bitbundler = require("bit-bundler");
var path = require("path");


module.exports = function(grunt) {
  function dest(files) {
    return files.map(function(file) {
      return file.dest;
    });
  }


  function sources(files) {
    return files.map(function(file) {
      return file.src;
    });
  }


  function resolveFiles(files) {
    return files.map(function(file) {
      return path.resolve(file);
    });
  }


  function bundleFiles(settings) {
    return function(files) {
      return createBundler(settings).bundle(files);
    };
  }


  function createBundler(settings) {
    return bitbundler(utils.merge({}, settings));
  }


  function writeBundles(files) {
    if (types.isString(files)) {
      files = [files];
    }

    return function(bundles) {
      return bundles.map(function(bundle, index) {
        Object.keys(bundle.parts).forEach(function(dest) {
          writeBundle(bundle.parts[dest], dest);
        });
        return writeBundle(bundle.bundle, files[index]);
      });
    };
  }


  function writeBundle(bundle, dest) {
    grunt.file.write(dest, bundle.result);
    return bundle;
  }


  function logError(err) {
    var errStr = err && err.stack || err;
    grunt.log.error(errStr);
    return err;
  }


  grunt.task.registerMultiTask("bitbundler", "bit bundler grunt plugin", function() {
    var settings = this.data || {};
    var done = this.async();

    try {
      Promise
        .all(
          sources(this.files)
            .map(resolveFiles)
            .map(bundleFiles(settings))
        )
        .then(writeBundles(dest(this.files)))
        .then(function() { done(); }, function(err) { logError(err); done(err); });
    }
    catch(err) {
      logError(err);
    }
  });
};
