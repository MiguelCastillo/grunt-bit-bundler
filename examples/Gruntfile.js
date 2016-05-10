var babel = require("babel-core");
var jsPlugin = require("bit-loader-js");
var splitBundle = require("bit-bundler-splitter");

/**
 * Simple transform for running babel-core directly from bit-bundler.
 */
function babelTransform(meta) {
  var transpiled = babel.transform(meta.source, {
    presets: ["es2015", "react"]
  });

  return {
    source: transpiled.code
  };
}

/**
 * Grunt task
 */
module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-bit-bundler");

  grunt.initConfig({
    bitbundler: {
      build: {
        files: [{
          dest: "dest/app.js",
          src: ["src/main.js", "src/react-app.js"]
        }],
        loader: {
          plugins: [
            jsPlugin({
              transform: babelTransform
            })
          ]
        },
        bundler: {
          plugins: [
            splitBundle("dest/vendor.js")
          ]
        }
      }
    }
  });

  grunt.registerTask("default", ["bitbundler:build"]);
};
