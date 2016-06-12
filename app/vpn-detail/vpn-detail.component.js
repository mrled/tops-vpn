'use strict';
angular.
  module('vpnDetail').
  component('vpnDetail', {
    templateUrl: 'vpn-detail/vpn-detail.template.html',
    controller: ['$routeParams', 'VpnData',
      function VpnDetailController($routeParams, VpnData) {
        var self = this;
        VpnData.get($routeParams.vpnId).then(function(data) {self.vpn = data;});
      }
    ]
  });
