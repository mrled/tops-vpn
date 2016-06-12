'use strict';

angular.
  module('core.vpndata').
  factory('VpnData', ['$http', '$q', 'fCsv', 'Util', 'Vpn',
    function($http, $q, fCsv, Util, Vpn) {

      var deferredRawCsvString = $q.defer(),
          deferredRawVpnObjs = $q.defer(),
          deferredVpnList = $q.defer();

      function parseTopsCsv(csvText) {

        // This will have double quotes surrounding keys and values
        // For instance: {'"VPN SERVICE"': '"3Monkey"'}
        var naiveObjs = angular.fromJson(fCsv.toJson(csvText));

        var parsedObjs = [];
        naiveObjs.forEach(function(obj, index, array) {
          var parsedObj = {};
          for (var prop in obj) {
            var unquotedKey = Util.unquoteString(prop),
                unquotedValue = Util.unquoteString(obj[prop]);
            parsedObj[unquotedKey] = unquotedValue;
          }
          parsedObjs.push(parsedObj);
        });

        return parsedObjs;
      }

      $http.get('vpns/tops.vpns.csv').then(function(response) {
        var rawCsvText = response.data;
        var rawCsvObjs = parseTopsCsv(rawCsvText);

        var vpnList = [];
        rawCsvObjs.forEach(function(vpnRow, index, array) {
          vpnList.push(Vpn.Vpn(vpnRow));
        });

        deferredRawCsvString.resolve(rawCsvText);
        deferredRawVpnObjs.resolve(rawCsvObjs);
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

        'queryRawCsv': function() {return deferredRawCsvString.promise;},
        'queryRawVpnObjs': function() {return deferredRawVpnObjs.promise;},
        'query': function() {return deferredVpnList.promise;}
      };
    }
  ]);
