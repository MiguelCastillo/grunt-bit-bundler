/*
 * grunt-bit-bundler
 * https://github.com/MiguelCastillo/bit-bundler
 *
 * Copyright (c) 2015 Miguel Castillo
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  require("load-grunt-tasks")(grunt);

  var pkg = require("./package.json");

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,

    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    bitbundler: {
      default_options: {
        files: {
          'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123']
        }
      },
      custom_options: {
        files: {
          'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123']
        },
        bundler: {
          sourceMap: false
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    },

    release: {
      options: {
        tagName: "v<%= version %>",
        tagMessage: "Version <%= version %>",
        commitMessage: "Release v<%= version %>",
        afterBump: ["jshint"]
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'bitbundler', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
