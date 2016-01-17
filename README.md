# grunt-bit-bundler

> bit-bundler grunt plugin

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-bit-bundler --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-bit-bundler');
```

## The "bitbundler" task

### Overview
In your project's Gruntfile, add a section named `bitbundler` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  bitbundler: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Usage Examples

#### Base configuration
In this example, bitbundler will load `src/testing` and `src/123` as entry modules, and the bundle is written to `dest/app.js`.  Using the bundler splitter, this configuration will automatically split out all vendor modules into its own bundle.

```js
var jsPlugin = require('bit-loader-js');
var splitBundle = require('bit-bundler-splitter');

grunt.initConfig({
  bitbundler: {
    files: [{
      dest:'dest/app.js',
      src: ['src/testing', 'src/123']
    }],
    loader: {
      plugins: [
        jsPlugin()
      ]
    },
    bundler: {
      plugins: [
        splitBundle('dest/vendor.js')
      ]
    }
  }
});
```

### License

Licensed under MIT
