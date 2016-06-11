/* jshint node: true, esversion: 6 */

'use strict';

var concat = require('gulp-concat');
var del = require('del');
var gulp = require('gulp');
var gutil = require('gulp-util');
var htmlreplace = require('gulp-html-replace');
var merge2 = require('merge2');
var pump = require('pump');
var uglify = require('gulp-uglify');

var conf = {
  paths: {
    assets: './app/assets',
    // css: './app/css',
    lib: './app/lib',
    // sdk: './app/sdk',
    wwwroot: './app'
  },
  errorHandler: function(title) {
    return function(err) {
      gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
      this.emit('end');
    };
  },
  lib: {
    base: 'node_modules',
    list: [
      require.resolve('angular-material/angular-material.css'),
      require.resolve('html5-boilerplate/dist/css/main.css'),
      require.resolve('html5-boilerplate/dist/css/normalize.css'),

      require.resolve('angular/angular.js'),
      require.resolve("angular-csv-service/angular-csv-service.js"),
      require.resolve("angular-aria/angular-aria.js"),
      require.resolve("angular-animate/angular-animate.js"),
      require.resolve("angular-material/angular-material.js"),
      require.resolve('angular-route/angular-route.js'),
      require.resolve('angular-resource/angular-resource.js')
      // require.resolve("html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js")
    ]
  },
  lib2: [
    // 'node_modules/angular-material/angular-material.css',
    // 'node_modules/html5-boilerplate/dist/css/main.css',
    // 'node_modules/html5-boilerplate/dist/css/normalize.css',

    'node_modules/angular/angular.js',
    'node_modules/angular-csv-service/angular-csv-service.js',
    'node_modules/angular-aria/angular-aria.js',
    'node_modules/angular-animate/angular-animate.js',
    'node_modules/angular-material/angular-material.js',
    'node_modules/angular-route/angular-route.js',
    'node_modules/angular-resource/angular-resource.js'
    // require.resolve("html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js")
  ]
};

gulp.task('lib', ['lib:clean'], function () {
  return gulp.src(conf.lib.list, { base: conf.lib.base })
    .pipe(gulp.dest(conf.paths.lib));
});

gulp.task('lib:clean', function () {
  return del([conf.paths.lib]);
});

gulp.task('mergejs-lib-nouglify', function (callback) {
  pump([
      gulp.src(conf.lib2),
      concat('lib.js'),
      // uglify(),
      gulp.dest('dist/')
    ],
    callback
  );
});
gulp.task('mergejs-app-nouglify', function (callback) {
  pump([
      gulp.src([
        'app/**/*.module.js',  // Modules have to be loaded first
        'app/core/**/*.js',    // I'd like to be able to just app/**/*.js at this point
        'app/vpn*/**/*.js',    // ... but lib stuff would get stuck in there too...
        'app/app*.js',
        '!**/*.spec.*'         // Exclude tests
      ]),
      concat('app.js'),
      // uglify(),
      gulp.dest('dist/')
    ],
    callback
  );
});
gulp.task('mergejs', function (callback) {
  pump([
      // gulp.src('app/**/*.js'),
      gulp.src(conf.lib2),
      concat('lib.js'),
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
        'appjs': 'app.js',
        'libjs': 'lib.js'
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

gulp.task('package', ['mergejs-lib-nouglify', 'mergejs-app-nouglify', 'mergecss', 'copyhtml', 'copydata']);

// gulp.task('default', [
//   'compress'
// ]);
// gulp.task('clean', ['lib:clean']);
// gulp.task('default', ['lib', 'styles', 'scripts']);
