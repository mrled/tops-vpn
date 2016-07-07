'use strict';

angular.
  module('topsvpn').
  component('vpnSelector', {
    templateUrl: 'topsvpn/vpn-selector/vpn-selector.template.html',
    controller: ['$q', 'VpnData',
      function ($q, VpnData) {
        var self = this;

        self.vpns = [];

        // An object where the keys are category names, and the values are feature names
        self.featuresByCategory = {};

        VpnData.query().then(function(vpns) {
          self.vpns = vpns;
          self.vpns[0].getCategoryList().forEach(function(category){
            self.featuresByCategory[category] =
              self.vpns[0].getFeaturesForCategory(category).map(function(feature){return feature.name;});
          });
        });

      }
    ]
  });
