'use strict';
angular
  .module('topsvpn')
  .component('vpnList', {
    templateUrl: 'topsvpn/vpn-list/vpn-list.template.html',
    controller: ['VpnData',
      function VpnListController(VpnData) {
        var self = this;
        VpnData.getVpns().then(function(data) {
          self.vpns = data;

          self.categories = [];
          self.fields = self.vpns[0].getFeatureList();

          self.vpns[0].getCategoryList().forEach(function(categoryname, index, array) {
          // for (var categoryname in self.vpns[0].getCategoryList()) {
            var category = {
              'name': categoryname,
              'fieldcount': self.vpns[0].getFeaturesForCategory(categoryname).length
            };
            self.categories.push(category);
          });

        });
      }
    ]
  });
