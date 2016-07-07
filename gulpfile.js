/* jshint node: true, esversion: 6 */

'use strict';

var path = require('path');

var concat = require('gulp-concat');
var del = require('del');
var gulp = require('gulp');
var htmlreplace = require('gulp-html-replace');
var pump = require('pump');
var uglify = require('gulp-uglify');

var dependencies = {
  nodemods: {
    css: [
      'node_modules/angular-material/angular-material.css',
      'node_modules/html5-boilerplate/dist/css/main.css',
      'node_modules/html5-boilerplate/dist/css/normalize.css'
    ],
    js: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-csv-service/angular-csv-service.js',
      'node_modules/angular-aria/angular-aria.js',
      'node_modules/angular-animate/angular-animate.js',
      'node_modules/angular-material/angular-material.js',
      'node_modules/angular-route/angular-route.js',
      'node_modules/angular-resource/angular-resource.js',
      'node_modules/html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js'
    ]
  },
  libraries: {
    js: [
      'libraries/mrl-util/mrl-util.js',
      'libraries/topsvpn/topsvpn.js'
    ]
  }
};


gulp.task('nodemods', ['nodemods:clean'], function (callback) {
  var allNodeMods = dependencies.nodemods.css.concat(dependencies.nodemods.js);
  pump([
      gulp.src(allNodeMods, {base: '.'}),
      gulp.dest('app')
    ],
    callback
  );
});

gulp.task('nodemods:clean', function () {
  return del(['app/node_modules']);
});

gulp.task('libs', ['libs:clean'], function (callback) {
  pump([
      gulp.src(dependencies.libraries.js, {base: '.'}),
      gulp.dest('app')
    ],
    callback
  );
});

gulp.task('libs:clean', function () {
  return del(['app/libraries']);
});

gulp.task('copydependencies', ['nodemods', 'libs']);

gulp.task('mergejs', function (callback) {
  pump([
      gulp.src([
        'app/dependencies/**/*.js',     // Dependencies (including Angular) have to be loaded first
        'app/libraries/**/*.js',        // Then our own libraries
        'app/**/*.module.js',           // Module definition files must be loaded before other Angular files
        'app/**/*.js',                  // Now load all other application code (order doesn't matter for this)
        '!**/*.spec.*',                 // Exclude tests
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
      gulp.src('app/datasource/**'),
      gulp.dest('dist/datasource/')
    ],
    callback
  );
});

gulp.task('package:clean', function () {
  return del(['./dist']);
});

gulp.task('package', ['mergejs', 'mergecss', 'copyhtml', 'copydata']);
