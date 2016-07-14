'use strict';

angular.
  module('topsvpn').
  component('vpnSelector', {
    templateUrl: 'topsvpn/vpn-selector/vpn-selector.template.html',
    controller: ['$scope', '$window', 'VpnData', 'MrlUtil',
      function ($scope, $window, VpnData, MrlUtil) {
        var self = this;

        self.vpns = [];
        self.featuresByCategory = {};
        self.featureValuesById = {};

        $scope.navigateToVpn = function(vpnId) {
          var vpnRelativePath = '#!/vpns/' + vpnId;
          var newLoc = $window.location.href.replace(/\#\!.*/, vpnRelativePath);
          $window.location.href = newLoc;
        };

        VpnData.getVpns().then(function(vpns) {
          self.vpns = vpns;
        });

        VpnData.mapCategoriesToFeatureIds().then(function(categoriesToFeatureIdsMap) {
          // It is probably not useful to be able to filter on company names/URLs/etc
          delete categoriesToFeatureIdsMap.company;
          self.featuresByCategory = categoriesToFeatureIdsMap;
        });

        VpnData.mapFeatureIdsToValues().then(function(featureIdsToValuesMap) {
          self.featureValuesById = featureIdsToValuesMap;
        });

      }
    ]
  });
