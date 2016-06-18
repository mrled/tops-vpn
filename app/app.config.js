'use strict';

angular.
  module('topsVpnApp').
  config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
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
