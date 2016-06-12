'use strict';

function VpnFeature(category, name, value) {
  this.category = category;
  this.name = name;
  this.value = value;
  return this;
}

angular.
  module('core.vpn').
  factory('Vpn', ['util',
    function(util) {
      return {

        'VpnObjectFactory': function(id, features) {

          this.id = id;
          this.features = features;

          this.getCategoryList = function(category) {
            var catList = [];
            this.features.forEach(function(feat, index, array) {
              if (! util.arrayContains(catList, feat.category)) {
                catList.push(feat.category);
              }
            });
            return catList;
          };

          this.getFeatureList = function() {
            var featList = [];
            this.features.forEach(function(feat, index, array) {
              featList.push(feat.name);
            });
            return featList;
          };

          this.getFeatureValue = function(category, feature) {
            function featureFilter(featureObj) {
              if (featureObj.category == category && featureObj.name == feature) { return true; } else { return false; }
            }
            var foundFeature = this.features.filter(featureFilter);
            if (foundFeature.length == 1) {
              return foundFeature[0].value;
            }
            else {
              return undefined;
            }
          };

          this.getFeaturesForCategory = function(category) {
            function featureFilter(featureObj) {
              if (featureObj.category == category) { return true; } else { return false; }
            }
            return this.features.filter(featureFilter);
          };

          return this;
        }

      };
    }
  ]);
