'use strict';

angular.module('topsvpnFeature').
  component('topsvpnFeature', {
    templateUrl: 'topsvpn-feature/topsvpn-feature.template.html',
    controller: ['Util', 'VpnData', function(Util, VpnData) {
        var self = this;
        self.featureValues = [];
        VpnData.query().then(function(data) {
          self.vpns = data;
          self.vpns.forEach(function(vpn, vpnIdx, vpnArr) {
            var feat = vpn.getFeatureValue(self.category, self.feature, "UNDEFINED");
            // console.log(vpn.id);
            Util.arrayPushUniq(self.featureValues, feat);
          });
        });
    }],
    bindings: {
      category: '@',
      feature: '@'
    }
  });
