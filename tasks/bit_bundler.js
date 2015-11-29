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
  grunt.task.registerMultiTask("bitbundler", "bit bundler grunt plugin", function() {
    var settings = this.data.options || {};
    var done = this.async();


    try {
      Promise
        .all(
          sources(this.files)
            .map(resolveFiles)
            .map(bundleFiles(settings))
        )
        .then(writeBundles(dest(this.files)))
        .then(bundleVendor(settings))
        .then(writeBundles(settings.splitVendor))
        .then(function() { done(); }, function(err) { logError(err); done(err); });
    }
    catch(err) {
      logError(err);
    }


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
        return createBundler(files, settings).bundle();
      };
    }


    function bundleVendor(settings) {
      return function(bundles) {
        var vendorSettings = utils.merge({}, {
          showInformation: settings.showInformation,
          splitVendor: false,
          browserPack: {
            hasExports: true
          }
        });

        return bundleFiles(vendorSettings)(getVendorFiles(bundles))
          .then(function(bundle) {
            return [bundle];
          });
      };
    }


    function getVendorFiles(bundles) {
      return bundles
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
    }


    function createBundler(files, settings) {
      return bitbundler(utils.merge({files: files}, settings));
    }


    function writeBundles(files) {
      if (types.isString(files)) {
        files = [files];
      }

      return function(bundles) {
        return bundles.map(function(bundle, index) {
          return writeBundle(bundle, files[index]);
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

  });
};
