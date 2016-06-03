'use strict';

function convertTopsVpnObjsToVpnObjs(objects) {
  var vpnList = [];
  objects.forEach(function(vpnRow, index, array) {

    // Normalize the VPN name so it can be easily used in a URL
    var vpnId = vpnRow['VPN SERVICE'].replace(/ /g, '').replace(/\//g, '');

    vpnList.push({
      'id': vpnId,
      'name': vpnRow['VPN SERVICE'],
      'activism': {
        'bitcoin': vpnRow['ACTIVISM Accepts Bitcoin'],
        'anonymous_payment': vpnRow['ACTIVISM Anonymous Payment Method'],
        'privacytoolsio': vpnRow['ACTIVISM Meets PrivacyTools IO Criteria']
      },
      'affiliates': {
        'fulldisclosure': vpnRow['AFFILIATES Give Full Disclosure'],
        'ethicalcopy': vpnRow['AFFILIATES Practice Ethical Copy']
      },
      'jurisdiction': {
        'basedin': vpnRow['JURISDICTION Based In (Country)'],
        'fourteeneyes': vpnRow["JURISDICTION Fourteen Eyes?"],
        'freedomstatus': vpnRow["JURISDICTION Freedom Status"]
      }
    });
  });
  return vpnList;
}


angular.
  module('core.vpn').
  factory('Vpn', ['$http', '$q', 'fCsv',
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

      $http.get('/vpns/tops.vpns.csv').then(function(response) {
        var rawCsvText = response.data;
        var rawVpnObjs = parseTopsCsv(rawCsvText);
        var vpnList = convertTopsVpnObjsToVpnObjs(rawVpnObjs);
        deferredRawCsvString.resolve(rawCsvText);
        deferredRawVpnObjs.resolve(rawVpnObjs);
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
