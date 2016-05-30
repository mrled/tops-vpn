'use strict';
angular.
  module('vpnDetail').
  component('vpnDetail', {
    templateUrl: 'vpn-detail/vpn-detail.template.html',
    controller: ['$routeParams', 'Vpn',
      function VpnDetailController($routeParams, Vpn) {
        var self = this;
        self.vpn = Vpn.get({vpnId: $routeParams.vpnId}, function (vpn) {});
      }
    ]
  });
