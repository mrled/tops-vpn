'use strict';
angular.
  module('vpnList').
  component('vpnList', {
    templateUrl: 'vpn-list/vpn-list.template.html',
    controller: ['Vpn',
      function VpnListController(Vpn) {
        var self = this;
        Vpn.query().then(function(data) {
          self.vpns = data;
          // self.categories = [];
          // self.fields = [];
          //
          // for (var categoryname in self.vpns[0]) {
          //   var category = {
          //     'name': categoryname,
          //     'fieldcount': 0
          //   };
          //   for (var fieldname in self.vpns[0][categoryname]) {
          //     category.fieldcount += 1;
          //     self.fields.push(fieldname);
          //   }
          //   self.categories.push(category);
          // }
        });
      }
    ]
  });
