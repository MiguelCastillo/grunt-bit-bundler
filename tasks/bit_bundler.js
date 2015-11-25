/*
 * grunt-bitbundler
 * https://github.com/MiguelCastillo/bit-bundler
 *
 * Copyright (c) 2015 Miguel Castillo
 * Licensed under the MIT license.
 */

"use strict";

var utils = require("belty");
var bitbundler = require("bit-bundler");
var path = require("path");

module.exports = function(grunt) {
  grunt.task.registerMultiTask("bitbundler", "bit bundler grunt plugin", function() {
    var settings = this.data.options || {};
    var done = this.async();


    resolveFiles(this.files)
      .then(bundleFiles(settings))
      .then(bundleVendor(settings))
      .then(function() { done(); }, function(err) { logError(err); done(err); });


    function resolveFiles(files) {
      return Promise.all(files.map(resolveFile));
    }


    function resolveFile(file) {
      var src = file.src.map(function(src) {
        return path.resolve(src);
      });

      return {
        src: src,
        dest: file.dest
      };
    }


    function bundleFiles(settings) {
      return function(files) {
        return Promise.all(
          files
            .map(createBundler(settings))
            .map(runBundler)
        );
      };
    }


    function bundleVendor(settings) {
      return function(allBundles) {
        var vendorSettings = { splitVendor: false, browserPack: { hasExports: true } };
        return bundleFiles(vendorSettings)([getVendorFiles(allBundles, settings.splitVendor)]);
      };
    }


    function getVendorFiles(allBundles, dest) {
      var vendorFiles = allBundles
        .reduce(function(container, bundles) {
          return container.concat(bundles);
        }, [])
        .reduce(function(container, bundles) {
          return container.concat(bundles.vendor);
        }, [])
        .reduce(function(container, vendor) {
          container.push(vendor.name);
          return container;
        }, []);

      return {
        src: vendorFiles,
        dest: dest
      };
    }


    function createBundler(settings) {
      return function(file) {
        return {
          file: file,
          bundler: bitbundler(utils.merge({files: file.src}, settings))
        };
      };
    }


    function runBundler(settings) {
      function writeBundle(allBundles) {
        var concatOutput = allBundles.reduce(function(output, bundles) {
          return output + ";" + bundles.result;
        }, "");

        grunt.file.write(settings.file.dest, concatOutput);
        return allBundles;
      }

      return settings.bundler.bundle().then(writeBundle);
    }


    function logError(err) {
      var errStr = err && err.stack || err;
      grunt.log.error(errStr);
      return err;
    }

  });
};
