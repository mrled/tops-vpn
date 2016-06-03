'use strict';
angular.
  module('vpnList').
  component('vpnList', {
    templateUrl: 'vpn-list/vpn-list.template.html',
    controller: ['Vpn',
      function VpnListController(Vpn) {
        var self = this;
        Vpn.query().then(function(data) {self.vpns = data;});
      }
    ]
  });
