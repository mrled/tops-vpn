//jshint strict: false
module.exports = function(config) {
  config.set({

    basePath: './app',

    files: [
      'dependencies/angular/angular.js',

      'dependencies/angular-animate/angular-animate.js',
      'dependencies/angular-aria/angular-aria.js',
      'dependencies/angular-csv-service/angular-csv-service.js',
      'dependencies/angular-material/angular-material.js',
      'dependencies/angular-mocks/angular-mocks.js',
      'dependencies/angular-route/angular-route.js',
      'dependencies/angular-resource/angular-resource.js',

      'topsutil/util.module.js',
      'topsutil/util.service.js',

      'topsvpn/topsvpn.module.js',
      'topsvpn/vpn/vpn.service.js',
      'topsvpn/vpndata/vpndata.service.js',

      '**/*.spec.js'
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
