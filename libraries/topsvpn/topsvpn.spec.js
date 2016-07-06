'use strict';

var mrlUtil = window.mrlUtil; // jshint ignore: line
var TopsVpn = window.TopsVpn; // jshint ignore: line

describe('TopsVpn', function() {

  describe('idNormalize', function() {
    it('should result in a name that can be a file', function() {
      expect(TopsVpn.idNormalize('asdf / qwer')).toBe('asdfqwer');
      expect(TopsVpn.idNormalize('093u4g0ij3,./l;[]--_\' / 2938jfo3ruh')).toMatch(/[a-zA-Z0-9]/);
    });
    it('should result in a name that does not need to be escaped as a URI component', function () {
      expect(encodeURIComponent(TopsVpn.idNormalize('asdf / qwer'))).toBe(TopsVpn.idNormalize('asdf / qwer'));
      expect(encodeURIComponent(TopsVpn.idNormalize('asdf \' \" :: \\/-_][., qwer'))).toBe(TopsVpn.idNormalize('asdf \' \" :: \\/-_][., qwer'));
    });
  });

  describe('VpnFeature', function() {
    var testFeatureA = new TopsVpn.VpnFeature('testCategoryA', 'testNameA');
    var testFeatureB = new TopsVpn.VpnFeature('testCategoryB', 'testNameB', 'testValueB');
    it('should have at least a name and a category', function() {
      expect(testFeatureA.name).toBe('testNameA');
      expect(testFeatureA.category).toBe('testCategoryA');
      expect(testFeatureB.value).toBe('testValueB');
      expect( function(){new TopsVpn.VpnFeature('', 'testCat') ;} ).toThrow();
      expect( function(){new TopsVpn.VpnFeature('testName', '');} ).toThrow();
    });
    it('should set a default type to string', function() {
      expect(testFeatureA.type).toBe('string');
      expect(testFeatureB.type).toBe('string');
    });
    it('should maybe convert strings with ints to real ints', function() {
      expect((new TopsVpn.VpnFeature('testCategory', 'testInt', '123', 'int')).value).toBe(123);
      expect((new TopsVpn.VpnFeature('testCategory', 'testInt', '123', 'int')).value).not.toBe('123');
      expect((new TopsVpn.VpnFeature('testCategory', 'testInt', 'actuallyastring', 'int')).value).toBe('actuallyastring');
      expect((new TopsVpn.VpnFeature('testCategory', 'testInt', '', 'int')).value).toBe('');
    });
    it('should maybe convert strings with floats to real floats', function() {
      expect((new TopsVpn.VpnFeature('testCategory', 'testFloat', '123', 'float')).value).toBe(123.0);
      expect((new TopsVpn.VpnFeature('testCategory', 'testFloat', '234.0', 'float')).value).toBe(234.0);
      expect((new TopsVpn.VpnFeature('testCategory', 'testFloat', '345.6', 'float')).value).toBe(345.6);
      expect((new TopsVpn.VpnFeature('testCategory', 'testFloat', '345.6', 'float')).value).not.toBe('345.6');
      expect((new TopsVpn.VpnFeature('testCategory', 'testFloat', 'actuallyastring', 'float')).value).toBe('actuallyastring');
      expect((new TopsVpn.VpnFeature('testCategory', 'testFloat', '', 'float')).value).toBe('');
    });
    it('should maybe convert strings with bools to real bools', function() {
      expect((new TopsVpn.VpnFeature('testCategory', 'testBool', '0', 'bool')).value).toBe(false);
      expect((new TopsVpn.VpnFeature('testCategory', 'testBool', '0', 'bool')).value).not.toBe('0');
      expect((new TopsVpn.VpnFeature('testCategory', 'testBool', '0', 'bool')).value).not.toBe('false');
      expect((new TopsVpn.VpnFeature('testCategory', 'testBool', 'false', 'bool')).value).toBe(false);
      expect((new TopsVpn.VpnFeature('testCategory', 'testBool', 'no', 'bool')).value).toBe(false);
      expect((new TopsVpn.VpnFeature('testCategory', 'testBool', '1', 'bool')).value).toBe(true);
      expect((new TopsVpn.VpnFeature('testCategory', 'testBool', 'yes', 'bool')).value).toBe(true);
      expect((new TopsVpn.VpnFeature('testCategory', 'testBool', '1234', 'bool')).value).toBe('1234');
      expect((new TopsVpn.VpnFeature('testCategory', 'testBool', 'actuallyastring', 'bool')).value).toBe('actuallyastring');
    });
  });

  describe('Vpn', function() {
    var testVpnFeatures = [
      new TopsVpn.VpnFeature('testCategory', 'featA', 'cerulean', 'string'),
      new TopsVpn.VpnFeature('testCategory', 'featB', '1234', 'int'),
      new TopsVpn.VpnFeature('testCategory', 'featC', '0.54', 'float')
    ];
    var testVpnFeaturesCount = 3;
    var testVpn = new TopsVpn.Vpn('test / Vpn', testVpnFeatures);
    it('should return a valid VPN based on the constructor', function() {
      expect(testVpn.name).toBe('test / Vpn');
      expect(testVpn.id).toBe('testVpn');
      expect(typeof testVpn.features).toBe('object');
      expect(testVpn.getFeatureList().length).toBe(testVpnFeaturesCount + 2); // +2 for name and id
    });
    it('should be able to get the features back that were passed in', function() {
      expect(testVpn.getFeaturesForCategory('testCategory').length).toBe(testVpnFeaturesCount);
    });
  });

});
