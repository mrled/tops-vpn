'use strict';

/* A small collection of utilities
 * To use from the browser:
 *   Add <script> tags that point to this JS file
 *   A property called `mrlUtil` will be attached to the `window` object
 * To use from Node:
 *   Use `require()`
 * NOTE: This pattern is similar to what React does, see:
 *       https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react.js
 */

(function(moduleFunc) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    // We're being imported by Node's require()
    module.exports = moduleFunc();
  } else if (typeof window !== "undefined") {
    // We're executing in the browser
    window.mrlUtil = moduleFunc(); // jshint ignore:line
  } else {
    throw "Cannot determine execution context";
  }
})(function moduleFunc() {

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

/* Fucking print a fucking message
 * Maybe in 20 years when fucking people adopt fucking ECMAScript 6 I can use fucking string interpolation
 */
function fuckingPrint() {
  var message = "";
  for (var i=0; i<arguments.length; i++) {
    message += arguments[i];
    // if (i !== arguments.length - 1) { message += " "; }
  }
  console.log(message);
}

/* Convert an object to a JSON string
 * If there are circular references in the object, replace them with "cirular: fieldName" instead
 * The 'space' parameter is passed directly to JSON.stringify()
 * Source: http://stackoverflow.com/a/11616993/868206
 */
function jsonStringifyCircs(object, space) {
  var cache = [];
  function turnCircsToStrings(key, value) {
    if (typeof(value) === 'object' && value !== null && arrayContains(cache, value)) {
      return "circular: "+key;
      // return null;
    }
    return value;
  }
  var jsonString = JSON.stringify(object, turnCircsToStrings, space);
  cache = null; // for GC
  return jsonString;
}

/* Determine whether an object has a property of a certain name
 */
function objectContainsKey(obj, key) {
  return true ? arrayContains(Object.keys(obj), key) : false;
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

return {
  arrayContains: arrayContains,
  arrayPushUniq: arrayPushUniq,
  fuckingPrint: fuckingPrint,
  jsonStringifyCircs: jsonStringifyCircs,
  objectContainsKey: objectContainsKey,
  objectSetPropertyIfUnset: objectSetPropertyIfUnset,
  parseBooleanMaybe: parseBooleanMaybe,
  parseFloatMaybe: parseFloatMaybe,
  parseIntMaybe: parseIntMaybe,
  unquoteString: unquoteString
};

});
