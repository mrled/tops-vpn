'use strict';

angular.
  module('core.vpndata').
  factory('VpnData', ['$http', '$q', 'fCsv',
    function($http, $q, fCsv) {

      var deferredRawCsvString = $q.defer(),
          deferredRawVpnObjs = $q.defer(),
          deferredVpnList = $q.defer();

      function parseTopsCsv(csvText) {

        // This will have double quotes surrounding keys and values
        // For instance: {'"VPN SERVICE"': '"3Monkey"'}
        var naiveObjs = angular.fromJson(fCsv.toJson(csvText));

        // If a string's first and last characters are a single or double quote, remove them
        // Otherwise, return the input
        // Very naive way to unquote something, but for the TOPS VPN CSV this is OK
        function unquoteString(string) {
          if (typeof(string) != "string") {
            return string;
          }
          else if ((string[0] == '"' && string.slice(-1) == '"') || (string[0] == "'" && string.slice(-1) == "'")) {
            return string.substring(1, (string.length -1));
          }
          else {
            return string;
          }
        }

        var parsedObjs = [];
        naiveObjs.forEach(function(obj, index, array) {
          var parsedObj = {};
          for (var prop in obj) {
            var unquotedKey = unquoteString(prop),
                unquotedValue = unquoteString(obj[prop]);
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
          vpnList.push(new Vpn(vpnRow));
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
