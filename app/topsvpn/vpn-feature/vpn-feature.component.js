'use strict';

angular
  .module('topsvpn')
  .component('vpnFeature', {
    templateUrl: 'topsvpn/vpn-feature/vpn-feature.template.html',
    controller: ['VpnData', '$scope', function(VpnData, $scope) {

      // TODO: Not sure about this. Might should be a lookup from a global table / database?
      function featureNameFromId(featureId) {
        return featureId.replace(/.*\//, '');
      }
      $scope.$ctrl.featureName = featureNameFromId($scope.$ctrl.featureId);

      VpnData.getFeatureValues($scope.$ctrl.featureId).then(
        function(featureValues) {
          $scope.$ctrl.featureValues = featureValues;
        },
        function(err) {
          // console.log("Failed to get feature values for id '" + $scope.$ctrl.featureId + "' with error '" + err + "'.");
        }
    );

    }],
    bindings: {
      featureId: '@'
    }
  });
