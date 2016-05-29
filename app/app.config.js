'use strict';

angular.
  module('topsVpnApp').
  config(['$locationProvider', '$routeProvider',
    function($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      // $routeProvider.otherwise({redirectTo: '/'});
    }
  ]);
