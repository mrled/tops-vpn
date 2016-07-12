'use strict';

angular.module('topsvpn').
  component('vpnFeature', {
    templateUrl: 'topsvpn/vpn-feature/vpn-feature.template.html',
    controller: ['VpnData', function(VpnData) {
      var self = this;
      VpnData.getFeatureValues(self.featureId).then(
        function(featureValues) {
          self.featureValues = featureValues;
        },
        function(err) {
          // console.log("Failed to get feature values for id '" + self.featureId + "' with error '" + err + "'.");
        }
    );

    }],
    bindings: {
      featureId: '@'
    }
  });
