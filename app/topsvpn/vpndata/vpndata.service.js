'use strict';

angular
  .module('topsvpn')
  .factory('VpnData', ['$http', '$q', 'MrlUtil', 'Vpn',
    function($http, $q, MrlUtil, Vpn) {

      var
        deferredDeserializedJson = $q.defer(),
        deferredVpnList = $q.defer(),
        deferredFeaturesByCategory = $q.defer(),
        deferredFeatureIdToValueMap = $q.defer();

      $http.get('datasource/tops.vpns.min.js').then(function(response) {
        var deserializedJson = response.data;

        var vpnList = [];
        deserializedJson.forEach(function(naiveObj) {
          vpnList.push(new Vpn.Vpn(naiveObj));
        });

        deferredDeserializedJson.resolve(deserializedJson);
        deferredVpnList.resolve(vpnList);
      });

      /* Get the deserialized JSON for the VPN list (for unit tests)
       */
      function getDeserializedJson() {
        return deferredDeserializedJson.promise;
      }

      /* Return a list of all vpns
       */
      function getVpns() {
        return deferredVpnList.promise;
      }

      /* Return a single VPN by its ID
       */
      function getVpn(vpnId) {
        var deferredVpn = $q.defer();
        getVpns().then(function(data) {
          function vpnFilterById(vpnEntry) {
            if (vpnEntry.id == vpnId) {return true;} else {return false;}
          }
          var foundVpn = data.filter(vpnFilterById)[0];
          if (foundVpn) {
            deferredVpn.resolve(foundVpn);
          }
          else {
            deferredVpn.reject("No such VPN ID");
          }
        });
        return deferredVpn.promise;
      }

      /* Return an object where the object's keys are feature IDs and the object's values
       * are arrays of possible feature values.
       * That is, the object's values are arrays of all values found in the VPNs we know about.
       *
       * So if we know about 3 VPNs that have a feature of a certain ID, and
       * the values those VPNs have for that feature are 1, 3, and 4, the object
       * this function returns will have a key for that feature ID, and its value will be
       * [1, 3, 4]. (Its value will NOT be a list of all numbers, and it will not be [1, 2, 3, 4].)
       */
      function mapFeatureIdsToValues() {
        getVpns().then(function(vpnList) {
          var featureIdToValueMap = {};
          vpnList.forEach(function(vpn) {
            vpn.features.forEach(function(feature) {
              if (MrlUtil.objectContainsKey(featureIdToValueMap, feature.id)) {
                MrlUtil.arrayPushUniq(featureIdToValueMap[feature.id], feature.value);
              }
              else {
                featureIdToValueMap[feature.id] = [feature.value];
              }
            });
          });
          deferredFeatureIdToValueMap.resolve(featureIdToValueMap);
        });
        return deferredFeatureIdToValueMap.promise;
      }

      /* Get a list of values for a feature of a given ID.
       */
      function getFeatureValues(featureId) {
        var deferredReturnValue = $q.defer();
        mapFeatureIdsToValues().then(function(featureValuesById) {
          if (MrlUtil.objectContainsKey(featureValuesById, featureId)) {
            deferredReturnValue.resolve(featureValuesById[featureId]);
          }
          else {
            deferredReturnValue.reject("No such feature ID");
          }
        });
        return deferredReturnValue.promise;
      }

      /* Return an object where the object's keys are category IDs and the object's values
       * are arrays of feature IDs in each category.
       * NOTE: We assume that all VPNs in our data set have the same set of features
       */
      function mapCategoriesToFeatureIds() {
        getVpns().then(function(vpnList) {
          var exemplarVpn = vpnList[0];
          var categoriesToFeatureIdsMap = {};
          exemplarVpn.features.forEach(function(feature) {
            if (MrlUtil.objectContainsKey(categoriesToFeatureIdsMap, feature.category)) {
              MrlUtil.arrayPushUniq(categoriesToFeatureIdsMap[feature.category], feature.id);
            }
            else {
              categoriesToFeatureIdsMap[feature.category] = [feature.id];
            }
          });
          deferredFeaturesByCategory.resolve(categoriesToFeatureIdsMap);
        });
        return deferredFeaturesByCategory.promise;
      }

      /* Get a list of feature IDs for a given category
       * NOTE: We assume that all VPNs in our data set have the same set of features
       */
      function getFeatureIds(category) {
        var deferredReturnValue = $q.defer();
        mapCategoriesToFeatureIds().then(function(categoriesToFeatureIdsMap) {
          if (categoriesToFeatureIdsMap[category]) {
            deferredReturnValue.resolve(categoriesToFeatureIdsMap[category]);
          }
          else {
            deferredReturnValue.reject("No such category ID");
          }
        });
        return deferredReturnValue.promise;
      }

      return {
        getDeserializedJson: getDeserializedJson,

        getVpns: getVpns,
        getVpn: getVpn,

        mapFeatureIdsToValues: mapFeatureIdsToValues,
        getFeatureValues: getFeatureValues,

        mapCategoriesToFeatureIds: mapCategoriesToFeatureIds,
        getFeatureIds: getFeatureIds
      };

    }
  ]);
