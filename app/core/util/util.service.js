'use strict';

/* Determine whether an array contains an object (portably)
 */
function arrayContains(array, object) {
  return true ? array.indexOf(object) !== -1 : false;
}

/* Push an object onto an array IFF the array doesn't already contain the object
 */
function arrayPushUniq(array, object) {
  if (!arrayContains(array, object)) {
    array.push(object);
  }
}

/* Set a property on an object only if the object doesn't have a property set with that name
 */
function objectSetPropertyIfUnset(object, property, value) {
  if (!arrayContains(Object.keys(object), property)) {
    object[property] = value;
  }
}

/* Get a boolean from a string (maybe)
 * If the string is one of: true/yes/1/false/no/0, return a boolean representing it
 * Otherwise, return the input (which might be empty)
 */
function parseBooleanMaybe(string) {
  if (typeof(string) != "string") {return string;}
  switch(string.toLowerCase().trim()){
    case "true": case "yes": case "1": return true;
    case "false": case "no": case "0": return false;
    default: return string;
  }
}

/* Get a float from a string (maybe)
 * If the string can be represented as a float, return the float
 * Otherwise, return the input (which might be empty)
 */
function parseFloatMaybe(string) {
  var parsed = parseFloat(string);
  return !isNaN(parsed) ? parsed : string;
}

/* Get an integer from a string (maybe)
 * If the string can be represented as an integer, return the integer
 * Otherwise, return the input (which might be empty)
 */
function parseIntMaybe(string) {
  var parsed = parseInt(string);
  return !isNaN(parsed) ? parsed : string;
}

/* If a string's first and last characters are a single or double quote, remove them
 * Otherwise, return the input
 * Very naive way to unquote something, but for the TOPS VPN CSV this is OK
 */
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

angular.
  module('core.util').
  factory('Util', [
    function() {
      return {
        'arrayContains': function(array, object) {return arrayContains(array, object);},
        'arrayPushUniq': function(array, object) {return arrayPushUniq(array, object);},
        'objectSetPropertyIfUnset': function(object, property, value) {return objectSetPropertyIfUnset(object, property, value);},
        'parseBooleanMaybe': function(string) {return parseBooleanMaybe(string);},
        'parseFloatMaybe': function(string) {return parseFloatMaybe(string);},
        'parseIntMaybe': function(string) {return parseFloatMaybe(string);},
        'unquoteString': function(string) {return unquoteString(string);}
      };
    }
  ]);
