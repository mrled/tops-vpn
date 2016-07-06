'use strict';

// jshint node: true

var config = require('./collect-vpns.config.js');

var Bing = require('node-bing-api')({ accKey: config.bingkey });
var jsdom = require('jsdom');
var Promise = require('bluebird');

var mrlUtil = require('../libraries/mrl-util/mrl-util.js');
var TopsVpn = require('../libraries/topsvpn/topsvpn.js');

/* Return the top Bing result URL for a string
 */
function getBucky(string) {
  var buckyUrl = Promise.defer();
  Bing.web(string, {
      top: 1,                                     // Only get 1 result
      options: ['DisableLocationDetection'],
      reqTimeout: 20000                           // The default is 5000
    }, function(error, res, body) {
      if (error) {
        buckyUrl.reject(error);
      }
      else {
        var bucky = body.d.results[0].Url;
        buckyUrl.resolve(bucky);
      }
    });
  return buckyUrl.promise;
}

/* Get info about a URL by asking the URL for it
 * Return an object containing information: head title, meta description, meta og:title, and meta og:description
 */
function getUrlInfo(inUrl) {
  var deferredUrlInfo = Promise.defer();

  jsdom.env(inUrl, [], function(errors, window) {
    if (errors) {
      deferredUrlInfo.reject(errors);
      return;
    }

    /* In the passed-in 'elementList', find all elements with attributes named
     * 'testAttribName' that have a value of 'testAttribValue', and return the
     * value of an element named 'resultAttribName'
     */
    function getHtmlAttributeValue(elementList, testAttribName, testAttribValue, resultAttribName) {
      for (var idx=0; idx < elementList.length; ++idx) {
        var element = elementList[idx];
        if (element.getAttribute(testAttribName) == testAttribValue) {
          var resultAttribValue = element.getAttribute(resultAttribName);
          return resultAttribValue ? resultAttribValue.toString() : "";
        }
      }
    }
    var metaElements = window.document.getElementsByTagName('meta');

    var urlInfo = {
      headTitle: window.document.title || "",
      metaDescription: getHtmlAttributeValue(metaElements, 'name', 'description', 'content'),
      metaOgDescription: getHtmlAttributeValue(metaElements, 'property', 'og:description', 'content'),
      metaOgTitle: getHtmlAttributeValue(metaElements, 'property', 'og:title', 'content')
    };

    deferredUrlInfo.resolve(urlInfo);
  });

  return deferredUrlInfo.promise;
}


/* A constructor for a VpnMetadataError object
 * Intended to capture errors that happen when gathering metadata like
 * VPN service URL, og:description, etc.
 */
function VpnMetadataError(action, error) {
  self.action = action;
  self.error = error;
  self.toString = toString;

  var self = this;

  function toString() {
    return "ERROR trying to perform " + self.action + ": " + self.error;
  }

  return self;
}


/* Return a new VPN object, wrapped in a Promise
 * When the promise resolves, all features of the VPN will have been set,
 * even ones that get data asynchronously by a Promise of their own
 */
function VpnWrapper(name, features) {
  if (!features) {features=[];}

  var deferredVpn = Promise.defer();
  var vpn = new TopsVpn.Vpn(name, features);

  var urlFeature = new TopsVpn.VpnFeature('company', 'url', '');
  vpn.features.push(urlFeature);
  var headTitleFeature = new TopsVpn.VpnFeature('company', 'headtitle', '');
  vpn.features.push(headTitleFeature);
  var metaDescriptionFeature = new TopsVpn.VpnFeature('company', 'metadescription', '');
  vpn.features.push(metaDescriptionFeature);
  var metaOgTitleFeature = new TopsVpn.VpnFeature('company', 'ogtitle', '');
  vpn.features.push(metaOgTitleFeature);
  var metaOgDescriptionFeature = new TopsVpn.VpnFeature('company', 'ogdescription', '');
  vpn.features.push(metaOgDescriptionFeature);

  var quotedVpnName = '"' + vpn.name + '"';
  getBucky(quotedVpnName).then(function(bucky) {
    urlFeature.value = bucky;
    return getUrlInfo(bucky).then(function(urlInfo) {
      headTitleFeature.value = urlInfo.headTitle;
      metaDescriptionFeature.value = urlInfo.metaDescription;
      metaOgTitleFeature.value = urlInfo.metaOgTitle;
      metaOgDescriptionFeature.value = urlInfo.metaOgDescription;
      deferredVpn.resolve(vpn);
    }, function(error) {
      var errorString;
      if (typeof error === 'object') {
        // Assume we're getting an Error object - which is (sometimes?) a circular object that cannot be JSONified directly
        var errName = error.name || "ERROR";
        var errMsg = error.message || "UNKNOWN";
        errorString = errName + ": " + errMsg;
      }
      else {
        errorString = error.toString();
      }
      vpn.metadataErrors.push(new TopsVpn.VpnMetadataError('getUrlInfo', errorString));

      deferredVpn.resolve(vpn); // We wanna catch this error then continue
      console.log("Couldn't get URL info for VPN '" + vpn.name + "':\n" + errorString);
    });
  }, function(error) {
    vpn.metadataErrors.push(new TopsVpn.VpnMetadataError('getBucky', mrlUtil.jsonStringifyCircs(error)));
    deferredVpn.resolve(vpn); // We wanna catch this error then continue
    console.log("Couldn't get Bucky for VPN '" + vpn.name + "':\n" + mrlUtil.jsonStringifyCircs(error, '  '));
  });

  return deferredVpn.promise;
}
