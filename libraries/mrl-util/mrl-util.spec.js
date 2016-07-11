'use strict';

/* jshint node: true */

// var mrlUtil = require('./mrl-util.js');
var mrlUtil = window.mrlUtil;  // jshint ignore:line

describe('mrlUtil', function() {
  it("should contain a working arrayContains()", function() {
    expect(mrlUtil.arrayContains([1, 2, 3, 4, 5], 3)).toBe(true);
    expect(mrlUtil.arrayContains([1, 2, 3, 4, 5], 6)).toBe(false);
  });

  it("should contain a working arrayPushUniq()", function() {
    var testArr = [1, 2, 3];
    mrlUtil.arrayPushUniq(testArr, 4);
    expect(testArr).toEqual([1, 2, 3, 4]);
    mrlUtil.arrayPushUniq(testArr, 2);
    expect(testArr).toEqual([1, 2, 3, 4]);
  });

  it("should contain a working objectContainsKey()", function() {
    var testObj = {one: 1, two: 2, three: 3};
    expect(mrlUtil.objectContainsKey(testObj, 'one')).toBe(true);
    expect(mrlUtil.objectContainsKey(testObj, 'four')).toBe(false);
  });

  it("should contain a working objectSetPropertyIfUnset()", function() {
    var testObj = {one: 1, two: 2, three: 3};
    mrlUtil.objectSetPropertyIfUnset(testObj, 'four', 4);
    expect(testObj).toEqual({one: 1, two: 2, three: 3, four: 4});
    mrlUtil.objectSetPropertyIfUnset(testObj, 'four', 4400);
    expect(testObj).toEqual({one: 1, two: 2, three: 3, four: 4});
  });

  it("should contain a working parseBooleanMaybe()", function() {
    expect(mrlUtil.parseBooleanMaybe(undefined)).toBe(undefined);
    expect(mrlUtil.parseBooleanMaybe(1)).toBe(1);
    expect(mrlUtil.parseBooleanMaybe("1")).toBe(true);
    expect(mrlUtil.parseBooleanMaybe("yes")).toBe(true);
    expect(mrlUtil.parseBooleanMaybe("true")).toBe(true);
    expect(mrlUtil.parseBooleanMaybe(0)).toBe(0);
    expect(mrlUtil.parseBooleanMaybe("0")).toBe(false);
    expect(mrlUtil.parseBooleanMaybe("no")).toBe(false);
    expect(mrlUtil.parseBooleanMaybe("false")).toBe(false);
    expect(mrlUtil.parseBooleanMaybe("anything else")).toBe("anything else");
    expect(mrlUtil.parseBooleanMaybe("ok")).toBe("ok");
  });

  it("should contain a working parseFloatMaybe()", function() {
    expect(mrlUtil.parseFloatMaybe("20")).toEqual(20);
    expect(mrlUtil.parseFloatMaybe("1.1")).toEqual(1.1);
    expect(mrlUtil.parseFloatMaybe("1")).toEqual(1.0);
    expect(mrlUtil.parseFloatMaybe("24523.21")).toEqual(24523.21);
    expect(mrlUtil.parseFloatMaybe("anything else")).toEqual("anything else");
  });

  it("should contain a working parseIntMaybe()", function() {
    expect(mrlUtil.parseIntMaybe("1")).toBe(1);
    expect(mrlUtil.parseIntMaybe("1.0")).toBe(1);
    expect(mrlUtil.parseIntMaybe("24523")).toBe(24523);
    expect(mrlUtil.parseIntMaybe("anything else")).toBe("anything else");
  });

  it("should contain a working unquoteString()", function() {
    expect(mrlUtil.unquoteString(1.0)).toBe(1.0);
    expect(mrlUtil.unquoteString(1234)).toBe(1234);
    expect(mrlUtil.unquoteString("1.0")).toBe("1.0");
    expect(mrlUtil.unquoteString("'string!!'")).toBe("string!!");
    expect(mrlUtil.unquoteString('"string!!"')).toBe("string!!");
    expect(mrlUtil.unquoteString("'nice' job 'mate'")).toBe("nice' job 'mate");
  });

});
