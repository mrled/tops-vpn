'use strict';

angular.
  module('topsVpnApp').
  config(['$locationProvider', '$routeProvider', '$mdThemingProvider',
    function config($locationProvider, $routeProvider, $mdThemingProvider) {

      $mdThemingProvider.theme('default')
        .primaryPalette('indigo')
        .accentPalette('green');

      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/vpns', {
          template: '<vpn-selector></vpn-selector>'
        }).
        when('/vpns/:vpnId', {
          template: '<vpn-detail></vpn-detail>'
        }).
        when('/table', {
          template: '<vpn-list></vpn-list>'
        }).
        otherwise('/vpns');
    }
  ]);
