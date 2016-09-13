'use strict';


angular
  .module('topsvpn')
  .factory('Vpn', ['MrlUtil',
    function(MrlUtil) {
      var TopsVpn = window.TopsVpn; // jshint ignore:line
      return TopsVpn;
    }
  ]);
