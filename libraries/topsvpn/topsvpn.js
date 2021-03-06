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

/* Return the name and category of a feature, based on its id
 */
function getFeatureIdNameCategory(featureId) {
  var splitId = featureId.split('/');
  return {
    category: splitId[0],
    name: splitId[1]
  };
}

/* Return a normalized string
 * The string should be suitable for use as an id
 * It should also be usable in a URL and on a filesystem without escaping
 */
function idNormalize(string) {
  return string.replace(/[^a-zA-Z0-9]/g, '');
}

/* Return a VpnFeature object
 * options:
 *   If this is a string, treat it as the feature category
 *   Otherwise, treat it as a serialized JSON version of a VPN
 *   (that is, it will have the properties, but not the methods, of a VPN object)
 * features:
 *   An optional list of features to add to the VPN
 *   NOTE: If options.features exists and is not empty, this parameter is ignored
 */
function VpnFeature(options, name, value, type) {
  var self = this;
  var valueStage, typeStage;
  if (typeof options === 'object') {
    self.category = options.category;
    self.name = options.name || name;
    valueStage = options.value || value;
    typeStage = options.type || type;
  }
  else if (typeof options === 'string') {
    self.category = options;
    self.name = name;
    valueStage = value;
    typeStage = type;
  }
  else {
    throw "Invalid arguments to VpnFeature constructor";
  }

  if (!self.category) {throw "Category is required";}
  if (!self.name) {throw "Name is required";}

  self.type = typeStage ? typeStage : 'string';
  self.value = undefined;
  self.id = self.category + '/' + self.name;
  self.toString = toString;

  switch (self.type) {
    case 'bool':   self.value = mrlUtil.parseBooleanMaybe(valueStage); break;
    case 'int':    self.value = mrlUtil.parseIntMaybe(valueStage); break;
    case 'float':  self.value = mrlUtil.parseFloatMaybe(valueStage); break;
    case 'string': self.value = valueStage; break;
    default:       throw "No such type: " + self.type;
  }

  return self;

  function toString() {
    return "VpnFeature(" + self.id + " = " + self.value + " <" + self.type + ">)";
  }
}


/* Return a VPN object
 * options:
 *   If this is a string, treat it as the name
 *   Otherwise, treat it as a serialized JSON version of a VPN
 *   (that is, it will have the properties, but not the methods, of a VPN object)
 * features:
 *   An optional list of features to add to the VPN
 *   NOTE: If options.features exists and is not empty, this parameter is ignored
 */
function Vpn(options, features) {
  var self = this;
  var featuresStage;

  if (typeof options === 'object') {
    self.name = options.name;
    self.id = options.id;
    featuresStage = options.features || features || [];
    self.metadataErrors = options.metadataErrors || [];
  }
  else if (typeof options === 'string') {
    self.name = options;
    self.id = idNormalize(self.name);
    featuresStage = features || [];
    self.metadataErrors = [];
  }
  else {
    throw "Invalid arguments to Vpn constructor";
  }

  self.features = [];
  featuresStage.forEach(function(featureOptions) {
    if (typeof featureOptions !== 'object') {
      // This means the source data is bad; not sure what caused this yet
      // TODO: fix source data!
      // console.log("Got a non-object feature for some reason: '" + featureOptions + "' of type '" + (typeof featureOptions) + "'");
    }
    else {
      self.features.push(new VpnFeature(featureOptions));
    }
  });

  self.addOrUpdateFeature = addOrUpdateFeature;
  self.getCategoryList = getCategoryList;
  self.getFeatureList = getFeatureList;
  self.getFeature = getFeature;
  self.getFeatureValue = getFeatureValue;
  self.getFeaturesForCategory = getFeaturesForCategory;
  self.toString = toString;

  self.addOrUpdateFeature(new VpnFeature('company', 'id', self.id));
  self.addOrUpdateFeature(new VpnFeature('company', 'name', self.name));

  /* Add or uodate a feature
   * If a feature with this category and name doesn't exist, add it
   * Otherwise, modify the existing feature
   */
  function addOrUpdateFeature(feature) {
    try {
      var foundFeature = getFeature(feature.category, feature.name);
      foundFeature.value = feature.value;
    }
    catch (err) {
      self.features.push(feature);
    }
  }

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

  /* Return a feature
   * category: the category the feature is in
   * feature: the name of the feature
   * return value: if the feature exists, return it; otherwise, throw
   */
  function getFeature(category, feature) {
    function featureFilter(featureObj) {
      if (featureObj.category == category && featureObj.name == feature) { return true; } else { return false; }
    }
    var foundFeature = self.features.filter(featureFilter);
    if (foundFeature.length == 1) {
      return foundFeature[0];
    }
    else {
      throw (new Error("No such feature '" + feature + "' in category '" + category + "' for vpn with id '" + self.id + "'"));
    }
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
    var featVal = self.getFeature(category, feature).value;
    return featVal ? featVal : defaultValue;
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
  getFeatureIdNameCategory: getFeatureIdNameCategory,
  idNormalize: idNormalize,
  Vpn: Vpn,
  VpnFeature: VpnFeature
};

});
