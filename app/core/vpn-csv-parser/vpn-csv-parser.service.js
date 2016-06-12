'use strict';

angular.
  module('core.vpnCsvParser').
  factory('VpnCsvParser', ['fCsv', 'core.util',
    function(fCsv, util) {


      function parseTopsCsv(csvText) {

        // This will have double quotes surrounding keys and values
        // For instance: {'"VPN SERVICE"': '"3Monkey"'}
        var naiveObjs = angular.fromJson(fCsv.toJson(csvText));

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


      return {

        'parse': function(csvRow) {
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
        }

      };
    }
  ]);
