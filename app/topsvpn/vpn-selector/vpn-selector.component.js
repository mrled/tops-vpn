'use strict';

angular.
  module('topsvpn').
  component('vpnSelector', {
    templateUrl: 'topsvpn/vpn-selector/vpn-selector.template.html',
    controller: ['$q', '$scope', '$window', 'Vpn', 'VpnData', 'MrlUtil',
      function ($q, $scope, $window, Vpn, VpnData, MrlUtil) {
        var self = this;

        self.vpns = [];
        self.featuresByCategory = {};

        // An on-click handler for a VPN button
        $scope.navigateToVpn = function(vpnId) {
          var vpnRelativePath = '#!/vpns/' + vpnId;
          var newLoc = $window.location.href.replace(/\#\!.*/, vpnRelativePath);
          $window.location.href = newLoc;
        };

        VpnData.getVpns().then(function(vpns) {
          self.vpns = vpns;
        });

        VpnData.mapCategoriesToFeatureIds().then(function(categoriesToFeatureIdsMap) {
          // TODO: clean up source data, so that I can do something more generic here
          // It is probably not useful to be able to filter on company names/URLs/etc
          // TODO: would be useful to have a search box for searching name/title/description
          delete categoriesToFeatureIdsMap.company;
          self.featuresByCategory = categoriesToFeatureIdsMap;
        });
      }
    ]
  });
