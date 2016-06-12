//jshint strict: false
module.exports = function(config) {
  config.set({

    basePath: './app',

    files: [
      'lib/angular/angular.js',
      'lib/angular-mocks/angular-mocks.js',
      'lib/angular-route/angular-route.js',
      'lib/angular-resource/angular-resource.js',

      'lib/angular-csv-service/angular-csv-service.js',

      'core/util/util.module.js',
      'core/util/util.service.js',
      'core/util/util.service.spec.js',

      'core/vpn/vpn.module.js',
      'core/vpn/vpn.service.js',

      'core/vpndata/vpndata.module.js',
      'core/vpndata/vpndata.service.js',
      'core/vpndata/vpndata.service.spec.js',

      'vpn-list/vpn-list.module.js',
      'vpn-list/vpn-list.component.js',
      'vpn-detail/vpn-detail.module.js',
      'vpn-detail/vpn-detail.component.js'

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
