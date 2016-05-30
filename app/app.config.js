'use strict';

angular.
  module('topsVpnApp').
  config(['$locationProvider', '$routeProvider',
    function($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/vpns', {
          template: '<vpn-list></vpn-list>'
        }).
        when('/vpns/:vpnId', {
          template: '<vpn-detail></vpn-detail>'
        }).
        otherwise('/vpns');
    }
  ]);
