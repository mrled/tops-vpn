'use strict';

var TopsvpnUtil; // Tell jshint to shut up, lmao UGGHHH

angular.
  module('LibWrapper').
  factory('LibWrapper', [
    function() {
      return {
        topsvpnUtil: TopsvpnUtil
      };
    }
  ]);
