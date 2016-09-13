'use strict';

var mrlUtil = window.mrlUtil; // jshint ignore:line

angular
  .module('topsutil')
  .factory('MrlUtil', [
    function() { return mrlUtil; }
  ]);
