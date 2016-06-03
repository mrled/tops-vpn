'use strict';
angular.
  module('vpnList').
  component('vpnList', {
    templateUrl: 'vpn-list/vpn-list.template.html',
    controller: ['Vpn',
      function VpnListController(Vpn) {
        this.vpns = Vpn.query();
      }
    ]
  });
