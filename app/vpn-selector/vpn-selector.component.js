'use strict';

angular.
  module('vpnSelector').
  component('vpnSelector', {
    templateUrl: 'vpn-selector/vpn-selector.template.html',
    controller: ['$q', 'VpnData', 'Util',
      function ($q, VpnData, Util) {
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
