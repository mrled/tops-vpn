//jshint strict: false
module.exports = function(config) {
  config.set({

    basePath: './app',

    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-resource/angular-resource.js',

      'bower_components/angular-csv-service/angular-csv-service.js',

      'core/vpn/vpn.module.js',
      'core/vpn/vpn.service.js',
      'core/vpn/vpn.service.spec.js',

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
