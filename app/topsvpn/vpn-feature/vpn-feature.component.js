'use strict';

angular.module('topsvpn').
  component('vpnFeature', {
    templateUrl: 'topsvpn/vpn-feature/vpn-feature.template.html',
    controller: ['MrlUtil', 'VpnData', function(MrlUtil, VpnData) {
        var self = this;
        self.featureValues = [];
        VpnData.query().then(function(data) {
          self.vpns = data;
          self.vpns.forEach(function(vpn, vpnIdx, vpnArr) {
            var feat = vpn.getFeatureValue(self.category, self.feature, "UNDEFINED");
            // console.log(vpn.id);
            MrlUtil.arrayPushUniq(self.featureValues, feat);
          });
        });
    }],
    bindings: {
      category: '@',
      feature: '@'
    }
  });
