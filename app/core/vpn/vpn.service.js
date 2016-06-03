'use strict';

/* Get a boolean from a string (maybe)
 * If the string is one of: true/yes/1/false/no/0, return a boolean representing it
 * Otherwise, return the input (which might be empty)
 */
function parseBooleanMaybe(string) {
  if (string === undefined) { return undefined; }
  switch(string.toLowerCase().trim()){
    case "true": case "yes": case "1": return true;
    case "false": case "no": case "0": return false;
    default: return string;
  }
}

function convertCsvObjsToVpnObjs(objects) {
  var vpnList = [];
  objects.forEach(function(vpnRow, index, array) {

    // Normalize the VPN name so it can be easily used in a URL
    var vpnId = vpnRow['VPN SERVICE'].replace(/ /g, '').replace(/\//g, '');

    vpnList.push({
      'company': {
        'id': vpnId,
        'name': vpnRow['VPN SERVICE']
      },
      'activism': {
        'bitcoin': parseBooleanMaybe(vpnRow['ACTIVISM Accepts Bitcoin']),
        'anonpayment': parseBooleanMaybe(vpnRow['ACTIVISM Anonymous Payment Method']),
        'privacytoolsio': parseBooleanMaybe(vpnRow['ACTIVISM Meets PrivacyTools IO Criteria'])
      },
      'affiliates': {
        'fulldisclosure': parseBooleanMaybe(vpnRow['AFFILIATES Give Full Disclosure']),
        'ethicalcopy': parseBooleanMaybe(vpnRow['AFFILIATES Practice Ethical Copy'])
      },
      'availability': {
        'connections': parseInt(vpnRow["AVAILABILITY # of Connections"]),
        'countries': parseInt(vpnRow["AVAILABILITY # of Countries"]),
        'servers': parseInt(vpnRow["AVAILABILITY # of Servers"])
      },
      'encryption': { // this is called 'SECURITY' in the csv
        'dataweakest': vpnRow["SECURITY Weakest Data Encryption"],
        'datastrongest': vpnRow["SECURITY Strongest Data Encryption"],
        'handshakeweakest': vpnRow["SECURITY Weakest Handshake Encryption"],
        'handshakestrongest': vpnRow["SECURITY Strongest Handshake Encryption"]
      },
      'ethics': {
        'contradictorylogging': parseBooleanMaybe(vpnRow["ETHICS Contradictory Logging Policies"]),
        'claim100effective': parseBooleanMaybe(vpnRow["ETHICS Falsely Claims 100% Effective"]),
        'spamincentive': parseBooleanMaybe(vpnRow["ETHICS Incentivizes Social Media Spam"])
      },
      'jurisdiction': {
        'basedin': vpnRow['JURISDICTION Based In (Country)'],
        'fourteeneyes': vpnRow["JURISDICTION Fourteen Eyes?"],
        'freedomstatus': vpnRow["JURISDICTION Freedom Status"]
      },
      'leakprotection': {
        'dns': parseBooleanMaybe(vpnRow["LEAK PROTECTION 1st Party DNS Servers"]),
        'ipv6': parseBooleanMaybe(vpnRow["LEAK PROTECTION IPv6 Supported / Blocked"]),
        'killswitch': parseBooleanMaybe(vpnRow["LEAK PROTECTION Kill Switch"])
      },
      'logging': {
        'traffic': parseBooleanMaybe(vpnRow["LOGGING Logs Traffic"]),
        'dns': parseBooleanMaybe(vpnRow["LOGGING Logs DNS Requests"]),
        'timestamps': parseBooleanMaybe(vpnRow["LOGGING Logs Timestamps"]),
        'bandwidth': parseBooleanMaybe(vpnRow["LOGGING Logs Bandwidth"]),
        'ip': parseBooleanMaybe(vpnRow["LOGGING Logs IP Address"])
      },
      'policies': {
        'forbidspam': parseBooleanMaybe(vpnRow["POLICIES Forbids Spam"]),
        'ethicalcopy': parseBooleanMaybe(vpnRow["POLICIES Requires Ethical Copy"]),
        'fulldisclosure': parseBooleanMaybe(vpnRow["POLICIES Requires Full Disclosure"])
      },
      'pricing': {
        'permonth': parseFloat(vpnRow["PRICING $ / Month (Annual Pricing)"]), // NOTE: this is the price per month if you buy a whole year
        'perconnectionpermonth': parseFloat(vpnRow["PRICING $ / Connection / Month"]),
        'freetrial': parseBooleanMaybe(vpnRow["PRICING Free Trial"]),
        'refundperiod': parseInt(vpnRow["PRICING Refund Period (Days)"])
      },
      'protocols': {
        'openvpn': parseBooleanMaybe(vpnRow["PROTOCOLS Offers OpenVPN"])
      },
      'website': {
        'persistentcookies': parseInt(vpnRow["WEBSITE # of Persistent Cookies"]),
        'trackers': parseInt(vpnRow["WEBSITE # of External Trackers"]),
        'proprietaryapis': parseInt(vpnRow["WEBSITE # of Proprietary APIs"]),
        'sslrating': vpnRow["WEBSITE Server SSL Rating"],
        'certcn': vpnRow["WEBSITE SSL Cert issued to"]
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
        var rawCsvObjs = parseTopsCsv(rawCsvText);
        var vpnList = convertCsvObjsToVpnObjs(rawCsvObjs);
        deferredRawCsvString.resolve(rawCsvText);
        deferredRawVpnObjs.resolve(rawCsvObjs);
        deferredVpnList.resolve(vpnList);
      });

      return {

        'get': function(vpnId) {
          var deferredVpn = $q.defer();
          deferredVpnList.promise.then(function(data) {
            function vpnFilterById(vpnEntry) {
              if (vpnEntry.company.id == vpnId) {return true;} else {return false;}
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
