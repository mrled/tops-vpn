'use strict';

function VpnFeature(category, name, value) {
  this.category = category;
  this.name = name;
  this.value = value;
  return this;
}

angular.
  module('topsvpn').
  factory('Vpn', ['Util',
    function(Util) {
      return {
        'Vpn': function(csvRow) {

          function Vpn(csvRow) {

            // Normalize the VPN name so it can be easily used in a URL
            this.id = csvRow['VPN SERVICE'].replace(/ /g, '').replace(/\//g, '');
            this.features = [
              new VpnFeature('company', 'id', this.id),
              new VpnFeature('company', 'name', csvRow['VPN SERVICE']),
              new VpnFeature('activism', 'bitcoin', Util.parseBooleanMaybe(csvRow['ACTIVISM Accepts Bitcoin'])),
              new VpnFeature('activism', 'anonpayment', Util.parseBooleanMaybe(csvRow['ACTIVISM Anonymous Payment Method'])),
              new VpnFeature('activism', 'privacytoolsio', Util.parseBooleanMaybe(csvRow['ACTIVISM Meets PrivacyTools IO Criteria'])),
              new VpnFeature('affiliates', 'fulldisclosure', Util.parseBooleanMaybe(csvRow['AFFILIATES Give Full Disclosure'])),
              new VpnFeature('affiliates', 'ethicalcopy', Util.parseBooleanMaybe(csvRow['AFFILIATES Practice Ethical Copy'])),
              new VpnFeature('availability', 'connections', Util.parseIntMaybe(csvRow["AVAILABILITY # of Connections"])),
              new VpnFeature('availability', 'countries', Util.parseIntMaybe(csvRow["AVAILABILITY # of Countries"])),
              new VpnFeature('availability', 'servers', Util.parseIntMaybe(csvRow["AVAILABILITY # of Servers"])),
              // NOTE: 'encryption' is called 'SECURITY' in the CSV
              new VpnFeature('encryption', 'dataweakest', csvRow["SECURITY Weakest Data Encryption"]),
              new VpnFeature('encryption', 'datastrongest', csvRow["SECURITY Strongest Data Encryption"]),
              new VpnFeature('encryption', 'handshakeweakest', csvRow["SECURITY Weakest Handshake Encryption"]),
              new VpnFeature('encryption', 'handshakestrongest', csvRow["SECURITY Strongest Handshake Encryption"]),
              new VpnFeature('ethics', 'contradictorylogging', Util.parseBooleanMaybe(csvRow["ETHICS Contradictory Logging Policies"])),
              new VpnFeature('ethics', 'claim100effective', Util.parseBooleanMaybe(csvRow["ETHICS Falsely Claims 100% Effective"])),
              new VpnFeature('ethics', 'spamincentive', Util.parseBooleanMaybe(csvRow["ETHICS Incentivizes Social Media Spam"])),
              new VpnFeature('jurisdiction', 'basedin', csvRow['JURISDICTION Based In (Country)']),
              new VpnFeature('jurisdiction', 'fourteeneyes', csvRow["JURISDICTION Fourteen Eyes?"]),
              new VpnFeature('jurisdiction', 'freedomstatus', csvRow["JURISDICTION Freedom Status"]),
              new VpnFeature('leakprotection', 'dns', Util.parseBooleanMaybe(csvRow["LEAK PROTECTION 1st Party DNS Servers"])),
              new VpnFeature('leakprotection', 'ipv6', Util.parseBooleanMaybe(csvRow["LEAK PROTECTION IPv6 Supported / Blocked"])),
              new VpnFeature('leakprotection', 'killswitch', Util.parseBooleanMaybe(csvRow["LEAK PROTECTION Kill Switch"])),
              new VpnFeature('logging', 'traffic', Util.parseBooleanMaybe(csvRow["LOGGING Logs Traffic"])),
              new VpnFeature('logging', 'dns', Util.parseBooleanMaybe(csvRow["LOGGING Logs DNS Requests"])),
              new VpnFeature('logging', 'timestamps', Util.parseBooleanMaybe(csvRow["LOGGING Logs Timestamps"])),
              new VpnFeature('logging', 'bandwidth', Util.parseBooleanMaybe(csvRow["LOGGING Logs Bandwidth"])),
              new VpnFeature('logging', 'ip', Util.parseBooleanMaybe(csvRow["LOGGING Logs IP Address"])),
              new VpnFeature('policies', 'forbidspam', Util.parseBooleanMaybe(csvRow["POLICIES Forbids Spam"])),
              new VpnFeature('policies', 'ethicalcopy', Util.parseBooleanMaybe(csvRow["POLICIES Requires Ethical Copy"])),
              new VpnFeature('policies', 'fulldisclosure', Util.parseBooleanMaybe(csvRow["POLICIES Requires Full Disclosure"])),
              new VpnFeature('portblocking', 'authsmtp', Util.parseBooleanMaybe(csvRow["PORT BLOCKING Auth SMTP"])),
              new VpnFeature('portblocking', 'p2p', Util.parseBooleanMaybe(csvRow["PORT BLOCKING P2P"])),
              // NOTE: this is the price per month if you buy a whole year)
              new VpnFeature('pricing', 'permonth', Util.parseFloatMaybe(csvRow["PRICING $ / Month (Annual Pricing)"])),
              new VpnFeature('pricing', 'perconnectionpermonth', Util.parseFloatMaybe(csvRow["PRICING $ / Connection / Month"])),
              new VpnFeature('pricing', 'freetrial', Util.parseBooleanMaybe(csvRow["PRICING Free Trial"])),
              new VpnFeature('pricing', 'refundperiod', Util.parseIntMaybe(csvRow["PRICING Refund Period (Days)"])),
              new VpnFeature('protocols', 'openvpn', Util.parseBooleanMaybe(csvRow["PROTOCOLS Offers OpenVPN"])),
              new VpnFeature('website', 'persistentcookies', Util.parseIntMaybe(csvRow["WEBSITE # of Persistent Cookies"])),
              new VpnFeature('website', 'trackers', Util.parseIntMaybe(csvRow["WEBSITE # of External Trackers"])),
              new VpnFeature('website', 'proprietaryapis', Util.parseIntMaybe(csvRow["WEBSITE # of Proprietary APIs"])),
              new VpnFeature('website', 'sslrating', csvRow["WEBSITE Server SSL Rating"]),
              new VpnFeature('website', 'certcn', csvRow["WEBSITE SSL Cert issued to"])
            ];

            this.getCategoryList = function(category) {
              var catList = [];
              this.features.forEach(function(feat, index, array) {
                if (! Util.arrayContains(catList, feat.category)) {
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

            /* Return the value of a feature
             * category: the category the feature is in
             * feature: the name of the feature
             * defaultValue: optional: if there is no value for the feature, return this instead
             * return value: if there is a value for the feature, return it
             *               if the value is empty for a feature, return an empty string
             *               if the value is empty for a feature and defaultValue is passed, return defaultValue
             *               if a feature does not exist, throw
             */
            this.getFeatureValue = function(category, feature, defaultValue) {
              if (!defaultValue) {defaultValue = "";}
              function featureFilter(featureObj) {
                if (featureObj.category == category && featureObj.name == feature) { return true; } else { return false; }
              }
              var foundFeature = this.features.filter(featureFilter);
              if (foundFeature.length == 1) {
                var featVal = foundFeature[0].value;
                return featVal ? featVal : defaultValue;
              }
              else {
                throw "No such feature '" + feature + "' in category '" + category + "' for vpn with id '" + this.id + "'";
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

          return new Vpn(csvRow);

        }
      };
    }
  ]);
