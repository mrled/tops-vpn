'use strict';

describe('core.util', function() {
  var Util;

  beforeEach(module('core.util'));

  beforeEach(inject(function(_Util_) {
    Util = _Util_;
  }));

  it("should contain a working arrayContains()", function() {
    expect(Util.arrayContains([1, 2, 3, 4, 5], 3)).toBe(true);
    expect(Util.arrayContains([1, 2, 3, 4, 5], 6)).toBe(false);
  });

  it("should contain a working arrayPushUniq()", function() {
    var testArr = [1, 2, 3];
    Util.arrayPushUniq(testArr, 4);
    expect(testArr).toEqual([1, 2, 3, 4]);
    Util.arrayPushUniq(testArr, 2);
    expect(testArr).toEqual([1, 2, 3, 4]);
  });

  it("should contain a working objectSetPropertyIfUnset()", function() {
    var testObj = {one: 1, two: 2, three: 3};
    Util.objectSetPropertyIfUnset(testObj, 'four', 4);
    expect(testObj).toEqual({one: 1, two: 2, three: 3, four: 4});
    Util.objectSetPropertyIfUnset(testObj, 'four', 4400);
    expect(testObj).toEqual({one: 1, two: 2, three: 3, four: 4});
  });

  it("should contain a working parseBooleanMaybe()", function() {
    expect(Util.parseBooleanMaybe(undefined)).toBe(undefined);
    expect(Util.parseBooleanMaybe(1)).toBe(1);
    expect(Util.parseBooleanMaybe("1")).toBe(true);
    expect(Util.parseBooleanMaybe("yes")).toBe(true);
    expect(Util.parseBooleanMaybe("true")).toBe(true);
    expect(Util.parseBooleanMaybe(0)).toBe(0);
    expect(Util.parseBooleanMaybe("0")).toBe(false);
    expect(Util.parseBooleanMaybe("no")).toBe(false);
    expect(Util.parseBooleanMaybe("false")).toBe(false);
    expect(Util.parseBooleanMaybe("anything else")).toBe("anything else");
    expect(Util.parseBooleanMaybe("ok")).toBe("ok");
  });

  it("should contain a working parseFloatMaybe()", function() {
    expect(Util.parseFloatMaybe("20")).toEqual(20);
    expect(Util.parseFloatMaybe("1.1")).toEqual(1.1);
    expect(Util.parseFloatMaybe("1")).toEqual(1.0);
    expect(Util.parseFloatMaybe("24523.21")).toEqual(24523.21);
    expect(Util.parseFloatMaybe("anything else")).toEqual("anything else");
  });

  it("should contain a working parseIntMaybe()", function() {
    expect(Util.parseIntMaybe("1")).toBe(1);
    expect(Util.parseIntMaybe("1.0")).toBe(1);
    expect(Util.parseIntMaybe("24523")).toBe(24523);
    expect(Util.parseIntMaybe("anything else")).toBe("anything else");
  });

  it("should contain a working unquoteString()", function() {
    expect(Util.unquoteString(1.0)).toBe(1.0);
    expect(Util.unquoteString(1234)).toBe(1234);
    expect(Util.unquoteString("1.0")).toBe("1.0");
    expect(Util.unquoteString("'string!!'")).toBe("string!!");
    expect(Util.unquoteString('"string!!"')).toBe("string!!");
    expect(Util.unquoteString("'nice' job 'mate'")).toBe("nice' job 'mate");
  });

});
