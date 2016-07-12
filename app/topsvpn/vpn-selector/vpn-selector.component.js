'use strict';

angular.
  module('topsvpn').
  component('vpnSelector', {
    templateUrl: 'topsvpn/vpn-selector/vpn-selector.template.html',
    controller: ['$q', 'VpnData', 'MrlUtil',
      function ($q, VpnData, MrlUtil) {
        var self = this;
        self.vpns = [];
        self.featuresByCategory = {};
        self.featureValuesById = {};
        VpnData.getVpns().then(function(vpns) {
          self.vpns = vpns;
        });
        VpnData.mapCategoriesToFeatureIds().then(function(categoriesToFeatureIdsMap) {
          self.featuresByCategory = categoriesToFeatureIdsMap;
        });
        var featureIdToValueMap;
        VpnData.mapFeatureIdsToValues().then(function(featureIdsToValuesMap) {
          self.featureValuesById = featureIdsToValuesMap;
        });
      }
    ]
  });
