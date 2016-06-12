'use strict';

function VpnFeature(category, name, value) {
  this.category = category;
  this.name = name;
  this.value = value;
  return this;
}

angular.
  module('core.vpnCsvParser').
  factory('VpnFeature', ['core.util',
    function(util) {
      return {
        'new': function(category, name, value) {
          return VpnFeature(category, name, value);
        }
      };
    }
  ]);
