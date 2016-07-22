'use strict';

angular.
  module('topsvpn').
  component('vpnSelector', {
    templateUrl: 'topsvpn/vpn-selector/vpn-selector.template.html',
    controller: ['$q', '$scope', '$window', 'Vpn', 'VpnData', 'MrlUtil',
      function ($q, $scope, $window, Vpn, VpnData, MrlUtil) {
        var self = this;

        self.vpnsPromise = VpnData.getVpns();
        self.featuresByCategoryPromise = VpnData.mapCategoriesToFeatureIds();
        self.featureValuesByIdPromise = VpnData.mapFeatureIdsToValues();

        self.vpns = [];
        self.featuresByCategory = {};
        self.featureValuesById = {};
        self.features = [];

        self.featureNameFromId = function(featureId) {
          return featureId.replace(/.*\//, '');
        };

        $scope.navigateToVpn = function(vpnId) {
          var vpnRelativePath = '#!/vpns/' + vpnId;
          var newLoc = $window.location.href.replace(/\#\!.*/, vpnRelativePath);
          $window.location.href = newLoc;
        };

        self.vpnsPromise.then(function(vpns) {
          self.vpns = vpns;
        });

        self.featuresByCategoryPromise.then(function(categoriesToFeatureIdsMap) {
          // It is probably not useful to be able to filter on company names/URLs/etc
          delete categoriesToFeatureIdsMap.company;
          self.featuresByCategory = categoriesToFeatureIdsMap;
        });

        $q.all([self.vpnsPromise, self.featureValuesByIdPromise]).then(function(resolved){
          var rVpns = resolved[0];
          var rFeatureValuesById = resolved[1];
          for (var featureId in rFeatureValuesById) {
            var name = Vpn.getFeatureIdNameCategory(featureId).name;
            var category = Vpn.getFeatureIdNameCategory(featureId).category;
            var type = rVpns[0].getFeature(category, name).type;
            var valueList = rFeatureValuesById[featureId];

            // Create a new VpnFeature object, but the value will be the list of all values
            var newFeature = new Vpn.VpnFeature(name, category, valueList, type);

            self.features.push(newFeature);
          }
        });

        self.featureValuesByIdPromise.then(function(featureIdsToValuesMap) {
          self.featureValuesById = featureIdsToValuesMap;
        });

      }
    ]
  });
