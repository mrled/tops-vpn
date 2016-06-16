//jshint strict: false
module.exports = function(config) {
  config.set({

    files: [
      'app/node_modules/angular/angular.js',
      'app/node_modules/angular-mocks/angular-mocks.js',
      'app/node_modules/angular-route/angular-route.js',
      'app/node_modules/angular-resource/angular-resource.js',

      'app/node_modules/angular-csv-service/angular-csv-service.js',

      'app/libraries/topsvpn-util/topsvpn-util.js',

      'app/libwrapper/libwrapper.module.js',
      'app/libwrapper/libwrapper.service.js',

      'app/core/util/util.module.js',
      'app/core/util/util.service.js',
      'app/core/vpn/vpn.module.js',
      'app/core/vpn/vpn.service.js',
      'app/core/vpndata/vpndata.module.js',
      'app/core/vpndata/vpndata.service.js',
      'app/vpn-list/vpn-list.module.js',
      'app/vpn-list/vpn-list.component.js',
      'app/vpn-detail/vpn-detail.module.js',
      'app/vpn-detail/vpn-detail.component.js',
      'app/vpn-selector/vpn-selector.module.js',
      'app/vpn-selector/vpn-selector.component.js',

      // Note: there are .spec.js files in libraries/ that will NOT be copied to app/libraries,
      // so we have to include them here:
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
