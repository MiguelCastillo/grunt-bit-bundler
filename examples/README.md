This is a grunt setup to generate bundles in which the source code uses ES2015 and React. The purpose is to illustrate a common workflow with React where transpilation is done via babel. The install steps are broken out into isolated parts that handle different parts of bundling process.

> The setup also consists of splitting out vendor modules out into its own bundle.

Installation
----------------

- install grunt task
  - `npm install grunt-bit-bundler --save-dev`
- install bit-bundler, js-plugin, and bundler-splitter
  - `npm install bit-bundler bit-loader-js bit-bundler-splitter --save-dev`
- install babel-core and presets
  - `npm install babel-core babel-preset-es2015 babel-preset-react --save-dev`
- install react and react-dom
  - `npm install react react-dom --save-dev`

This is what the actual grunt confguration looks like:

``` javascript
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
```


Disection
------------

TODO.