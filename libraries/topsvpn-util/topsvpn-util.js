'use strict';

// var topsvpnUtil = modules.exports = function() {
// var topsvpnUtil = function() {
var TopsvpnUtil = {

  /* Determine whether an array contains an object (portably)
   */
  arrayContains: function(array, object) {
    return true ? array.indexOf(object) !== -1 : false;
  },

  /* Push an object onto an array IFF the array doesn't already contain the object
   */
  arrayPushUniq: function(array, object) {
    if (!this.arrayContains(array, object)) {
      array.push(object);
    }
  },

  /* Set a property on an object only if the object doesn't have a property set with that name
   */
  objectSetPropertyIfUnset: function(object, property, value) {
    if (!this.arrayContains(Object.keys(object), property)) {
      object[property] = value;
    }
  },

  /* Get a boolean from a string (maybe)
   * If the string is one of: true/yes/1/false/no/0, return a boolean representing it
   * Otherwise, return the input (which might be empty)
   */
  parseBooleanMaybe: function(string) {
    if (typeof(string) != "string") {return string;}
    switch(string.toLowerCase().trim()){
      case "true": case "yes": case "1": return true;
      case "false": case "no": case "0": return false;
      default: return string;
    }
  },

  /* Get a float from a string (maybe)
   * If the string can be represented as a float, return the float
   * Otherwise, return the input (which might be empty)
   */
  parseFloatMaybe: function(string) {
    var parsed = parseFloat(string);
    return !isNaN(parsed) ? parsed : string;
  },

  /* Get an integer from a string (maybe)
   * If the string can be represented as an integer, return the integer
   * Otherwise, return the input (which might be empty)
   */
  parseIntMaybe: function(string) {
    var parsed = parseInt(string);
    return !isNaN(parsed) ? parsed : string;
  },

  /* If a string's first and last characters are a single or double quote, remove them
   * Otherwise, return the input
   * Very naive way to unquote something, but for the TOPS VPN CSV this is OK
   */
  unquoteString: function(string) {
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

};
