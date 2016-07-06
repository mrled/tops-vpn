'use strict';

(function (moduleFunc) {
  // jshint ignore: start
  if (typeof exports === "object" && typeof module !== "undefined") {
    // We're being imported by Node's require()
    module.exports = moduleFunc(
      require('../mrl-util/mrl-util.js'),
      console.log);
  } else if (typeof window !== "undefined") {
    // We're executing in the browser
    window.TopsVpn = moduleFunc(
      window.mrlUtil,
      console.log);
  } else {
    throw "Cannot determine execution context";
  }
  // jshint ignore: end
})(function (mrlUtil, logger) {

/* Return a normalized string
 * The string should be suitable for use as an id
 * It should also be usable in a URL and on a filesystem without escaping
 */
function idNormalize(string) {
  return string.replace(/[^a-zA-Z0-9]/g, '');
}

function VpnFeature(category, name, value, type) {
  if (!category) {throw "Category is required";}
  if (!name) {throw "Name is required";}

  var self = this;
  self.category = category;
  self.name = name;
  self.type = type ? type : 'string';
  self.value = '';
  self.toString = toString;

  switch (self.type) {
    case 'bool':   self.value = mrlUtil.parseBooleanMaybe(value); break;
    case 'int':    self.value = mrlUtil.parseIntMaybe(value); break;
    case 'float':  self.value = mrlUtil.parseFloatMaybe(value); break;
    case 'string': self.value = value; break;
    default:       throw "No such type: " + self.type;
  }

  return self;

  function toString() {
    return self.category + "::" + self.name + "::" + self.value + "<" + self.type + ">";
  }
}

function Vpn(name, features) {
  var self = this;
  self.id = idNormalize(name);
  self.name = name;
  self.features = features || [];
  self.features.push(
    new VpnFeature('company', 'id', self.id),
    new VpnFeature('company', 'name', self.name)
  );
  self.metadataErrors = [];
  self.getCategoryList = getCategoryList;
  self.getFeatureList = getFeatureList;
  self.getFeatureValue = getFeatureValue;
  self.getFeaturesForCategory = getFeaturesForCategory;
  self.toString = toString;

  /* Get a list of feature categories
   */
  function getCategoryList(category) {
    var catList = [];
    self.features.forEach(function(feat, index, array) {
      if (! mrlUtil.arrayContains(catList, feat.category)) {
        catList.push(feat.category);
      }
    });
    return catList;
  }

  /* Get a list of feature names
   * (The array of feature objects is accessible using just self.features)
   */
  function getFeatureList() {
    var featList = [];
    self.features.forEach(function(feat, index, array) {
      featList.push(feat.name);
    });
    return featList;
  }

  /* Return the value of a feature
   * category: the category the feature is in
   * feature: the name of the feature
   * defaultValue: optional: if there is no value for the feature, return this instead
   * return value: if there is a value for the feature, return it
   *               if the value is empty for a feature, return an empty string
   *               if the value is empty for a feature and defaultValue is passed, return defaultValue
   *               if a feature does not exist, throw
   */
  function getFeatureValue(category, feature, defaultValue) {
    if (!defaultValue) {defaultValue = "";}
    function featureFilter(featureObj) {
      if (featureObj.category == category && featureObj.name == feature) { return true; } else { return false; }
    }
    var foundFeature = self.features.filter(featureFilter);
    if (foundFeature.length == 1) {
      var featVal = foundFeature[0].value;
      return featVal ? featVal : defaultValue;
    }
    else {
      throw "No such feature '" + feature + "' in category '" + category + "' for vpn with id '" + self.id + "'";
    }
  }

  /* Return all feature objects for a given category
   */
  function getFeaturesForCategory(category) {
    function featureFilter(featureObj) {
      if (featureObj.category == category) { return true; } else { return false; }
    }
    return self.features.filter(featureFilter);
  }

  function toString() {
    return "[VPN: " + self.id + ", " + self.features.length + "features]";
  }

  return self;
}

return {
  idNormalize: idNormalize,
  Vpn: Vpn,
  VpnFeature: VpnFeature
};

});
