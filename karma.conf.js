//jshint strict: false
module.exports = function(config) {
  config.set({

    basePath: './app',

    files: [
      'dependencies/angular/angular.js',
      'dependencies/angular-mocks/angular-mocks.js',
      'dependencies/angular-route/angular-route.js',
      'dependencies/angular-resource/angular-resource.js',

      'dependencies/angular-csv-service/angular-csv-service.js',

      'core/util/util.module.js',
      'core/util/util.service.js',
      'core/vpn/vpn.module.js',
      'core/vpn/vpn.service.js',
      'core/vpndata/vpndata.module.js',
      'core/vpndata/vpndata.service.js',
      'vpn-list/vpn-list.module.js',
      'vpn-list/vpn-list.component.js',
      'vpn-detail/vpn-detail.module.js',
      'vpn-detail/vpn-detail.component.js',
      'vpn-selector/vpn-selector.module.js',
      'vpn-selector/vpn-selector.component.js',

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
