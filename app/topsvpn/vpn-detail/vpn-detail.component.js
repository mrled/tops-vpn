'use strict';
angular.
  module('topsvpn').
  component('vpnDetail', {
    templateUrl: 'topsvpn/vpn-detail/vpn-detail.template.html',
    controller: ['$routeParams', 'VpnData',
      function VpnDetailController($routeParams, VpnData) {
        var self = this;
        VpnData.getVpn($routeParams.vpnId).then(function(vpn) {
          self.vpn = vpn;
        });
      }
    ]
  });
