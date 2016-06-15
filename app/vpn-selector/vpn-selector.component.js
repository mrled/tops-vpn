'use strict';

angular.
  module('vpnSelector').
  component('vpnSelector', {
    templateUrl: 'vpn-selector/vpn-selector.template.html',
    controller: ['$q', 'VpnData', 'Util',
      function ($q, VpnData, Util) {
        var self = this;

        self.vpns = [];

        // A dictionary where keys are categories and values are (dictionaries where keys are feature names and values are an array of feature values)
        self.featuresByCategory = {};

        VpnData.query().then(function(vpns) {
          self.vpns = vpns;
          vpns.forEach(function(vpn, vpnIdx, vpnArr) {
            vpn.getCategoryList().forEach(function(category, catIdx, catArr) {
              Util.objectSetPropertyIfUnset(self.featuresByCategory, category, {});
              vpn.getFeaturesForCategory(category).forEach(function(feature, featIdx, featArr) {
                Util.objectSetPropertyIfUnset(self.featuresByCategory[category], feature.name, []);
                Util.arrayPushUniq(self.featuresByCategory[category][feature.name], feature.value);
              });
            });
          });
        });

      }
    ]
  });
