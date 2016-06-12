/* jshint node: true, esversion: 6 */

'use strict';

var concat = require('gulp-concat');
var del = require('del');
var gulp = require('gulp');
var htmlreplace = require('gulp-html-replace');
var pump = require('pump');
var uglify = require('gulp-uglify');

var conf = {
  paths: {
    lib: './app/lib',
    wwwroot: './app'
  },
  lib: {
    base: 'node_modules',
    css: [
      require.resolve('angular-material/angular-material.css'),
      require.resolve('html5-boilerplate/dist/css/main.css'),
      require.resolve('html5-boilerplate/dist/css/normalize.css')
    ],
    js: [
      require.resolve('angular/angular.js'),
      require.resolve('angular-mocks/angular-mocks.js'),
      require.resolve("angular-csv-service/angular-csv-service.js"),
      require.resolve("angular-aria/angular-aria.js"),
      require.resolve("angular-animate/angular-animate.js"),
      require.resolve("angular-material/angular-material.js"),
      require.resolve('angular-route/angular-route.js'),
      require.resolve('angular-resource/angular-resource.js'),
      require.resolve("html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js")
    ]
  }
};

gulp.task('lib', ['lib:clean'], function (callback) {
  var allLibs = conf.lib.css.concat(conf.lib.js);
  pump([
      gulp.src(allLibs, {base: conf.lib.base}),
      gulp.dest(conf.paths.lib)
    ],
    callback
  );
});

gulp.task('lib:clean', function () {
  return del([conf.paths.lib]);
});

gulp.task('mergejs', function (callback) {
  pump([
      gulp.src([
        'app/lib/**/*.js',     // Libraries (including Angular) have to be loaded first
        'app/**/*.module.js',  // Module definition files must be loaded before other Angular files
        'app/**/*.js',         // Now load all other application code (order doesn't matter for this)
        '!**/*.spec.*',        // Exclude tests
      ]),
      concat('app.js'),
      uglify(),
      gulp.dest('dist/')
    ],
    callback
  );
});

gulp.task('mergecss', function (callback) {
  pump([
      gulp.src('app/**/*.css'),
      concat('app.css'),
      gulp.dest('dist/')
    ],
    callback
  );
});

gulp.task('copyhtml', function(callback) {
  pump([
      gulp.src('app/**/*.html'),
      htmlreplace({
        'appcss': 'app.css',
        'appjs': 'app.js'
      }),
      gulp.dest('dist/')
    ],
    callback
  );
});

gulp.task('copydata', function(callback) {
  pump([
      gulp.src('app/vpns/**'),
      gulp.dest('dist/vpns/')
    ],
    callback
  );
});

gulp.task('package:clean', function () {
  return del(['./dist']);
});

gulp.task('package', ['mergejs', 'mergecss', 'copyhtml', 'copydata']);
