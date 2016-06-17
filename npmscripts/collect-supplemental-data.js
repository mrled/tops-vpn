#!/usr/bin/env node
/* jshint esversion: 6, node: true */

'use strict';

var path = require('path');

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var http = Promise.promisifyAll(require('http'));

// There's a synchronous version of this but AFAICT there's no way to fucking require() it
// JavaScript is a fucking garbage fire sometimes
var csvParse = Promise.promisify(require('csv-parse'));

var TopsvpnUtil = require(path.join(__dirname, "..", "libraries", "topsvpn-util", "topsvpn-util.js"));

/* Return a normalized string
 * The string should be suitable for use as an id
 * It should also be usable in a URL and on a filesystem without escaping
 */
function idNormalize(string) {
  return string.replace(/ /g, '').replace(/\//g, '');
}

function VpnFeature(category, name, value) {
  this.category = category;
  this.name = name;
  this.value = value;
  return this;
}

function Vpn(name, features) {
  this.id = idNormalize(name);
  this.name = name;
  this.features = features;
  this.features.push(
    new VpnFeature('company', 'id', this.id)
  );

  this.getCategoryList = function(category) {
    var catList = [];
    this.features.forEach(function(feat, index, array) {
      if (! TopsvpnUtil.arrayContains(catList, feat.category)) {
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

function VpnFromCsvRow(csvRow) {

  var name = csvRow['VPN SERVICE'];
  var features = [
    // new VpnFeature('company', 'id', this.id),
    new VpnFeature('company', 'name', csvRow['VPN SERVICE']),
    new VpnFeature('activism', 'bitcoin', TopsvpnUtil.parseBooleanMaybe(csvRow['ACTIVISM Accepts Bitcoin'])),
    new VpnFeature('activism', 'anonpayment', TopsvpnUtil.parseBooleanMaybe(csvRow['ACTIVISM Anonymous Payment Method'])),
    new VpnFeature('activism', 'privacytoolsio', TopsvpnUtil.parseBooleanMaybe(csvRow['ACTIVISM Meets PrivacyTools IO Criteria'])),
    new VpnFeature('affiliates', 'fulldisclosure', TopsvpnUtil.parseBooleanMaybe(csvRow['AFFILIATES Give Full Disclosure'])),
    new VpnFeature('affiliates', 'ethicalcopy', TopsvpnUtil.parseBooleanMaybe(csvRow['AFFILIATES Practice Ethical Copy'])),
    new VpnFeature('availability', 'connections', TopsvpnUtil.parseIntMaybe(csvRow["AVAILABILITY # of Connections"])),
    new VpnFeature('availability', 'countries', TopsvpnUtil.parseIntMaybe(csvRow["AVAILABILITY # of Countries"])),
    new VpnFeature('availability', 'servers', TopsvpnUtil.parseIntMaybe(csvRow["AVAILABILITY # of Servers"])),
    // NOTE: 'encryption' is called 'SECURITY' in the CSV
    new VpnFeature('encryption', 'dataweakest', csvRow["SECURITY Weakest Data Encryption"]),
    new VpnFeature('encryption', 'datastrongest', csvRow["SECURITY Strongest Data Encryption"]),
    new VpnFeature('encryption', 'handshakeweakest', csvRow["SECURITY Weakest Handshake Encryption"]),
    new VpnFeature('encryption', 'handshakestrongest', csvRow["SECURITY Strongest Handshake Encryption"]),
    new VpnFeature('ethics', 'contradictorylogging', TopsvpnUtil.parseBooleanMaybe(csvRow["ETHICS Contradictory Logging Policies"])),
    new VpnFeature('ethics', 'claim100effective', TopsvpnUtil.parseBooleanMaybe(csvRow["ETHICS Falsely Claims 100% Effective"])),
    new VpnFeature('ethics', 'spamincentive', TopsvpnUtil.parseBooleanMaybe(csvRow["ETHICS Incentivizes Social Media Spam"])),
    new VpnFeature('jurisdiction', 'basedin', csvRow['JURISDICTION Based In (Country)']),
    new VpnFeature('jurisdiction', 'fourteeneyes', csvRow["JURISDICTION Fourteen Eyes?"]),
    new VpnFeature('jurisdiction', 'freedomstatus', csvRow["JURISDICTION Freedom Status"]),
    new VpnFeature('leakprotection', 'dns', TopsvpnUtil.parseBooleanMaybe(csvRow["LEAK PROTECTION 1st Party DNS Servers"])),
    new VpnFeature('leakprotection', 'ipv6', TopsvpnUtil.parseBooleanMaybe(csvRow["LEAK PROTECTION IPv6 Supported / Blocked"])),
    new VpnFeature('leakprotection', 'killswitch', TopsvpnUtil.parseBooleanMaybe(csvRow["LEAK PROTECTION Kill Switch"])),
    new VpnFeature('logging', 'traffic', TopsvpnUtil.parseBooleanMaybe(csvRow["LOGGING Logs Traffic"])),
    new VpnFeature('logging', 'dns', TopsvpnUtil.parseBooleanMaybe(csvRow["LOGGING Logs DNS Requests"])),
    new VpnFeature('logging', 'timestamps', TopsvpnUtil.parseBooleanMaybe(csvRow["LOGGING Logs Timestamps"])),
    new VpnFeature('logging', 'bandwidth', TopsvpnUtil.parseBooleanMaybe(csvRow["LOGGING Logs Bandwidth"])),
    new VpnFeature('logging', 'ip', TopsvpnUtil.parseBooleanMaybe(csvRow["LOGGING Logs IP Address"])),
    new VpnFeature('policies', 'forbidspam', TopsvpnUtil.parseBooleanMaybe(csvRow["POLICIES Forbids Spam"])),
    new VpnFeature('policies', 'ethicalcopy', TopsvpnUtil.parseBooleanMaybe(csvRow["POLICIES Requires Ethical Copy"])),
    new VpnFeature('policies', 'fulldisclosure', TopsvpnUtil.parseBooleanMaybe(csvRow["POLICIES Requires Full Disclosure"])),
    new VpnFeature('portblocking', 'authsmtp', TopsvpnUtil.parseBooleanMaybe(csvRow["PORT BLOCKING Auth SMTP"])),
    new VpnFeature('portblocking', 'p2p', TopsvpnUtil.parseBooleanMaybe(csvRow["PORT BLOCKING P2P"])),
    // NOTE: this is the price per month if you buy a whole year)
    new VpnFeature('pricing', 'permonth', TopsvpnUtil.parseFloatMaybe(csvRow["PRICING $ / Month (Annual Pricing)"])),
    new VpnFeature('pricing', 'perconnectionpermonth', TopsvpnUtil.parseFloatMaybe(csvRow["PRICING $ / Connection / Month"])),
    new VpnFeature('pricing', 'freetrial', TopsvpnUtil.parseBooleanMaybe(csvRow["PRICING Free Trial"])),
    new VpnFeature('pricing', 'refundperiod', TopsvpnUtil.parseIntMaybe(csvRow["PRICING Refund Period (Days)"])),
    new VpnFeature('protocols', 'openvpn', TopsvpnUtil.parseBooleanMaybe(csvRow["PROTOCOLS Offers OpenVPN"])),
    new VpnFeature('website', 'persistentcookies', TopsvpnUtil.parseIntMaybe(csvRow["WEBSITE # of Persistent Cookies"])),
    new VpnFeature('website', 'trackers', TopsvpnUtil.parseIntMaybe(csvRow["WEBSITE # of External Trackers"])),
    new VpnFeature('website', 'proprietaryapis', TopsvpnUtil.parseIntMaybe(csvRow["WEBSITE # of Proprietary APIs"])),
    new VpnFeature('website', 'sslrating', csvRow["WEBSITE Server SSL Rating"]),
    new VpnFeature('website', 'certcn', csvRow["WEBSITE SSL Cert issued to"])
  ];

  return new Vpn(name, features);
}

function parseTopsCsv(csvPath, outJsonPath) {
  fs.readFileAsync(csvPath, {encoding: "utf8"}).then(function(csvText) {
    return csvParse(csvText, {columns: true});
  }).then(function(parsedCsv) {
    var vpns = [];
    parsedCsv.forEach(function(row) {
      vpns.push(VpnFromCsvRow(row));
    });
    fs.writeFileAsync(outJsonPath, JSON.stringify(vpns));
  });
}

var csvPath = path.join(__dirname, "..", "app", "datasource", "tops.vpns.csv");
var outJsonPath = path.join(__dirname, "..", "app", "datasource", "tops.vpns.js");
var vpns = parseTopsCsv(csvPath);
