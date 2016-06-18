'use strict';
angular.
  module('topsvpn').
  component('vpnDetail', {
    templateUrl: 'topsvpn/vpn-detail/vpn-detail.template.html',
    controller: ['$routeParams', 'VpnData',
      function VpnDetailController($routeParams, VpnData) {
        var self = this;
        VpnData.get($routeParams.vpnId).then(function(data) {self.vpn = data;});
      }
    ]
  });
