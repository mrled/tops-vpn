//jshint strict: false
module.exports = function(config) {
  config.set({

    // basePath: './app',

    files: [
      './app/node_modules/angular/angular.js',

      './app/node_modules/angular-animate/angular-animate.js',
      './app/node_modules/angular-aria/angular-aria.js',
      './app/node_modules/angular-csv-service/angular-csv-service.js',
      './app/node_modules/angular-material/angular-material.js',
      './app/node_modules/angular-mocks/angular-mocks.js',
      './app/node_modules/angular-route/angular-route.js',
      './app/node_modules/angular-resource/angular-resource.js',

      './libraries/mrl-util/mrl-util.js',

      './app/topsvpn/topsvpn.module.js',

      './app/topsutil/util.module.js',
      './app/topsutil/util.service.js',

      './app/topsvpn/vpn/vpn.service.js',
      './app/topsvpn/vpndata/vpndata.service.js',

      'libraries/**/*.spec.js',
      'app/**/*.spec.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-junit-reporter'
    ],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
