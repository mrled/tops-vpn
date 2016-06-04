'use strict';

function arrayContains(array, object) {
  return true ? array.indexOf(object) !== -1 : false;
}

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

/* Get an integer from a string (maybe)
 * If the string can be represented as an integer, return the integer
 * Otherwise, return the input (which might be empty)
 */
function parseIntMaybe(string) {
  var parsed = parseInt(string);
  return parsed ? !isNaN(parsed) : string;
}

/* Get an integer from a string (maybe)
 * If the string can be represented as an integer, return the integer
 * Otherwise, return the input (which might be empty)
 */
function parseFloatMaybe(string) {
  var parsed = parseFloat(string);
  return parsed ? !isNaN(parsed) : string;
}


function VpnFeature(category, name, value) {
  this.category = category;
  this.name = name;
  this.value = value;
  return this;
}

// function Vpn(csvRow) {
function Vpn(csvRow) {

  // Normalize the VPN name so it can be easily used in a URL
  this.id = csvRow['VPN SERVICE'].replace(/ /g, '').replace(/\//g, '');
  this.features = [
    new VpnFeature('company', 'id', this.id),
    new VpnFeature('company', 'name', csvRow['VPN SERVICE']),
    new VpnFeature('activism', 'bitcoin', parseBooleanMaybe(csvRow['ACTIVISM Accepts Bitcoin'])),
    new VpnFeature('activism', 'anonpayment', parseBooleanMaybe(csvRow['ACTIVISM Anonymous Payment Method'])),
    new VpnFeature('activism', 'privacytoolsio', parseBooleanMaybe(csvRow['ACTIVISM Meets PrivacyTools IO Criteria'])),
    new VpnFeature('affiliates', 'fulldisclosure', parseBooleanMaybe(csvRow['AFFILIATES Give Full Disclosure'])),
    new VpnFeature('affiliates', 'ethicalcopy', parseBooleanMaybe(csvRow['AFFILIATES Practice Ethical Copy'])),
    new VpnFeature('availability', 'connections', parseIntMaybe(csvRow["AVAILABILITY # of Connections"])),
    new VpnFeature('availability', 'countries', parseIntMaybe(csvRow["AVAILABILITY # of Countries"])),
    new VpnFeature('availability', 'servers', parseIntMaybe(csvRow["AVAILABILITY # of Servers"])),
    // NOTE: 'encryption' is called 'SECURITY' in the CSV
    new VpnFeature('encryption', 'dataweakest', csvRow["SECURITY Weakest Data Encryption"]),
    new VpnFeature('encryption', 'datastrongest', csvRow["SECURITY Strongest Data Encryption"]),
    new VpnFeature('encryption', 'handshakeweakest', csvRow["SECURITY Weakest Handshake Encryption"]),
    new VpnFeature('encryption', 'handshakestrongest', csvRow["SECURITY Strongest Handshake Encryption"]),
    new VpnFeature('ethics', 'contradictorylogging', parseBooleanMaybe(csvRow["ETHICS Contradictory Logging Policies"])),
    new VpnFeature('ethics', 'claim100effective', parseBooleanMaybe(csvRow["ETHICS Falsely Claims 100% Effective"])),
    new VpnFeature('ethics', 'spamincentive', parseBooleanMaybe(csvRow["ETHICS Incentivizes Social Media Spam"])),
    new VpnFeature('jurisdiction', 'basedin', csvRow['JURISDICTION Based In (Country)']),
    new VpnFeature('jurisdiction', 'fourteeneyes', csvRow["JURISDICTION Fourteen Eyes?"]),
    new VpnFeature('jurisdiction', 'freedomstatus', csvRow["JURISDICTION Freedom Status"]),
    new VpnFeature('leakprotection', 'dns', parseBooleanMaybe(csvRow["LEAK PROTECTION 1st Party DNS Servers"])),
    new VpnFeature('leakprotection', 'ipv6', parseBooleanMaybe(csvRow["LEAK PROTECTION IPv6 Supported / Blocked"])),
    new VpnFeature('leakprotection', 'killswitch', parseBooleanMaybe(csvRow["LEAK PROTECTION Kill Switch"])),
    new VpnFeature('logging', 'traffic', parseBooleanMaybe(csvRow["LOGGING Logs Traffic"])),
    new VpnFeature('logging', 'dns', parseBooleanMaybe(csvRow["LOGGING Logs DNS Requests"])),
    new VpnFeature('logging', 'timestamps', parseBooleanMaybe(csvRow["LOGGING Logs Timestamps"])),
    new VpnFeature('logging', 'bandwidth', parseBooleanMaybe(csvRow["LOGGING Logs Bandwidth"])),
    new VpnFeature('logging', 'ip', parseBooleanMaybe(csvRow["LOGGING Logs IP Address"])),
    new VpnFeature('policies', 'forbidspam', parseBooleanMaybe(csvRow["POLICIES Forbids Spam"])),
    new VpnFeature('policies', 'ethicalcopy', parseBooleanMaybe(csvRow["POLICIES Requires Ethical Copy"])),
    new VpnFeature('policies', 'fulldisclosure', parseBooleanMaybe(csvRow["POLICIES Requires Full Disclosure"])),
    // NOTE: this is the price per month if you buy a whole year)
    new VpnFeature('pricing', 'permonth', parseFloatMaybe(csvRow["PRICING $ / Month (Annual Pricing)"])),
    new VpnFeature('pricing', 'perconnectionpermonth', parseFloatMaybe(csvRow["PRICING $ / Connection / Month"])),
    new VpnFeature('pricing', 'freetrial', parseBooleanMaybe(csvRow["PRICING Free Trial"])),
    new VpnFeature('pricing', 'refundperiod', parseIntMaybe(csvRow["PRICING Refund Period (Days)"])),
    new VpnFeature('protocols', 'openvpn', parseBooleanMaybe(csvRow["PROTOCOLS Offers OpenVPN"])),
    new VpnFeature('website', 'persistentcookies', parseIntMaybe(csvRow["WEBSITE # of Persistent Cookies"])),
    new VpnFeature('website', 'trackers', parseIntMaybe(csvRow["WEBSITE # of External Trackers"])),
    new VpnFeature('website', 'proprietaryapis', parseIntMaybe(csvRow["WEBSITE # of Proprietary APIs"])),
    new VpnFeature('website', 'sslrating', csvRow["WEBSITE Server SSL Rating"]),
    new VpnFeature('website', 'certcn', csvRow["WEBSITE SSL Cert issued to"])
  ];

  this.getCategoryList = function(category) {
    var catList = [];
    this.features.forEach(function(feat, index, array) {
      if (! arrayContains(catList, feat.category)) {
        catList.push(feat.category);
      }
    });
    return catList;
  };
  this.getFeatureList = function() {
    var featList = [];
    this.features.forEach(function(feat, index, array) {
      featList.push(feat.name);
    });
    return featList;
  };

  this.getFeatureValue = function(category, feature) {
    function featureFilter(featureObj) {
      if (featureObj.category == category && featureObj.name == feature) { return true; } else { return false; }
    }
    var foundFeature = this.features.filter(featureFilter);
    if (foundFeature.length == 1) {
      return foundFeature[0].value;
    }
    else {
      return undefined;
    }
  };

  this.getFeaturesForCategory = function(category) {
    function featureFilter(featureObj) {
      if (featureObj.category == category) { return true; } else { return false; }
    }
    return this.features.filter(featureFilter);
  };

  return this;
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
