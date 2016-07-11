'use strict';

var mrlUtil = window.mrlUtil; // jshint ignore:line

angular.
  module('topsutil').
  factory('MrlUtil', [
    function() {
      return {
        'arrayContains': function(array, object) {return mrlUtil.arrayContains(array, object);},
        'arrayPushUniq': function(array, object) {return mrlUtil.arrayPushUniq(array, object);},
        'objectContainsKey': function(object, key) {return mrlUtil.objectContainsKey(object, key);},
        'objectSetPropertyIfUnset': function(object, property, value) {return mrlUtil.objectSetPropertyIfUnset(object, property, value);},
        'parseBooleanMaybe': function(string) {return mrlUtil.parseBooleanMaybe(string);},
        'parseFloatMaybe': function(string) {return mrlUtil.parseFloatMaybe(string);},
        'parseIntMaybe': function(string) {return mrlUtil.parseFloatMaybe(string);},
        'unquoteString': function(string) {return mrlUtil.unquoteString(string);}
      };
    }
  ]);
