'use strict';
/* jshint node: true */

var TopsvpnUtil; // Tell jshint to shut up, lmao UGGHHH

describe('topsvpn-util', function() {

  it("should contain a working arrayContains()", function() {
    expect(TopsvpnUtil.arrayContains([1, 2, 3, 4, 5], 3)).toBe(true);
    expect(TopsvpnUtil.arrayContains([1, 2, 3, 4, 5], 6)).toBe(false);
  });

  it("should contain a working arrayPushUniq()", function() {
    var testArr = [1, 2, 3];
    TopsvpnUtil.arrayPushUniq(testArr, 4);
    expect(testArr).toEqual([1, 2, 3, 4]);
    TopsvpnUtil.arrayPushUniq(testArr, 2);
    expect(testArr).toEqual([1, 2, 3, 4]);
  });

  it("should contain a working objectSetPropertyIfUnset()", function() {
    var testObj = {one: 1, two: 2, three: 3};
    TopsvpnUtil.objectSetPropertyIfUnset(testObj, 'four', 4);
    expect(testObj).toEqual({one: 1, two: 2, three: 3, four: 4});
    TopsvpnUtil.objectSetPropertyIfUnset(testObj, 'four', 4400);
    expect(testObj).toEqual({one: 1, two: 2, three: 3, four: 4});
  });

  it("should contain a working parseBooleanMaybe()", function() {
    expect(TopsvpnUtil.parseBooleanMaybe(undefined)).toBe(undefined);
    expect(TopsvpnUtil.parseBooleanMaybe(1)).toBe(1);
    expect(TopsvpnUtil.parseBooleanMaybe("1")).toBe(true);
    expect(TopsvpnUtil.parseBooleanMaybe("yes")).toBe(true);
    expect(TopsvpnUtil.parseBooleanMaybe("true")).toBe(true);
    expect(TopsvpnUtil.parseBooleanMaybe(0)).toBe(0);
    expect(TopsvpnUtil.parseBooleanMaybe("0")).toBe(false);
    expect(TopsvpnUtil.parseBooleanMaybe("no")).toBe(false);
    expect(TopsvpnUtil.parseBooleanMaybe("false")).toBe(false);
    expect(TopsvpnUtil.parseBooleanMaybe("anything else")).toBe("anything else");
    expect(TopsvpnUtil.parseBooleanMaybe("ok")).toBe("ok");
  });

  it("should contain a working parseFloatMaybe()", function() {
    expect(TopsvpnUtil.parseFloatMaybe("20")).toEqual(20);
    expect(TopsvpnUtil.parseFloatMaybe("1.1")).toEqual(1.1);
    expect(TopsvpnUtil.parseFloatMaybe("1")).toEqual(1.0);
    expect(TopsvpnUtil.parseFloatMaybe("24523.21")).toEqual(24523.21);
    expect(TopsvpnUtil.parseFloatMaybe("anything else")).toEqual("anything else");
  });

  it("should contain a working parseIntMaybe()", function() {
    expect(TopsvpnUtil.parseIntMaybe("1")).toBe(1);
    expect(TopsvpnUtil.parseIntMaybe("1.0")).toBe(1);
    expect(TopsvpnUtil.parseIntMaybe("24523")).toBe(24523);
    expect(TopsvpnUtil.parseIntMaybe("anything else")).toBe("anything else");
  });

  it("should contain a working unquoteString()", function() {
    expect(TopsvpnUtil.unquoteString(1.0)).toBe(1.0);
    expect(TopsvpnUtil.unquoteString(1234)).toBe(1234);
    expect(TopsvpnUtil.unquoteString("1.0")).toBe("1.0");
    expect(TopsvpnUtil.unquoteString("'string!!'")).toBe("string!!");
    expect(TopsvpnUtil.unquoteString('"string!!"')).toBe("string!!");
    expect(TopsvpnUtil.unquoteString("'nice' job 'mate'")).toBe("nice' job 'mate");
  });

});
