'use strict';

angular.
  module('topsvpn').
  factory('VpnData', ['$http', '$q', 'MrlUtil', 'Vpn',
    function($http, $q, MrlUtil, Vpn) {

      var deferredDeserializedJson = $q.defer(),
          deferredVpnList = $q.defer();

      $http.get('datasource/tops.vpns.min.js').then(function(response) {
        var deserializedJson = response.data;

        var vpnList = [];
        deserializedJson.forEach(function(naiveObj) {
          vpnList.push(new Vpn.Vpn(naiveObj));
        });

        deferredDeserializedJson.resolve(deserializedJson);
        deferredVpnList.resolve(vpnList);
      });

      return {

        'get': function(vpnId) {
          var deferredVpn = $q.defer();
          deferredVpnList.promise.then(function(data) {
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
        },

        'query': function() {return deferredVpnList.promise;},

        'queryDeserializedJson': function() {return deferredDeserializedJson.promise;}
      };
    }
  ]);
