'use strict';

angular.
  module('core.vpn').
  factory('Vpn', ['$resource',
    function($resource) {
      return $resource('vpns/:vpnId.json', {}, {
        getAll: {
          // This relies on having a file called "vpns.json"
          // TODO: Don't rely on this file existing & being up to date
          method: 'GET',
          params: {vpnId: 'vpns'},
          isArray: true
        }
      });
    }
  ]);
