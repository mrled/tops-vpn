'use strict';

angular
  .module('topsvpn')
  .filter('matchesFeature', ['MrlUtil', function(MrlUtil) {
    /* matchesFeature: filter input VPNs based on feature values
     * vpnList:
     *   an array of Vpn objects
     * allowedFeatureValues:
     *   a hashtable, where each key is a feature ID, and each value is a list of permitted values
     *   if a feature ID is not present in the allowedFeatureValues hashtable, it is not filtered
     *   Example: return only VPNs from the input list that are based in Switzerland or Belize:
     *     {'jurisdiction/basedin': ['Switzerland', 'Belize']}
     */
    return function(vpnList, allowedFeatureValues) {
      vpnList = vpnList || [];
      if ((typeof allowedFeatureValues !== 'object') || (Object.keys(allowedFeatureValues).length < 1)) {
        return vpnList;
      }
      var filteredFeatureIds = Object.keys(allowedFeatureValues);
      var filteredVpnList = [];

      function vpnPassesFilter(vpn) {
        var failure = false;
        filteredFeatureIds.forEach(function(filteredFeatureId) {

          // TODO: I need a guaranteed way to get a feature category/name from an ID...
          // this will work for now, but it'll break if a category/name has a space in it
          var category = filteredFeatureId.split('/')[0];
          var name = filteredFeatureId.split('/')[1];

          var allowedValue = allowedFeatureValues[filteredFeatureId];
          var vpnValue = vpn.getFeatureValue(category, name);
          var vpnHasAllowedValue = MrlUtil.arrayContains(allowedValue, vpnValue);

          if (! vpnHasAllowedValue) { failure = true; }
        });

        return ! failure;
      }

      vpnList.forEach(function(vpn) {
        if (vpnPassesFilter(vpn)) {
          filteredVpnList.push(vpn);
        }
      });

      return filteredVpnList;
    };
  }]
);
