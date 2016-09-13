'use strict';

describe('matchesFeature', function() {

  var $filter;
  var MrlUtil;
  var Vpn;
  var matchesFeature;

  beforeEach(function() {
    module('topsvpn');
    module('topsutil');
    inject(function(_MrlUtil_, _Vpn_, _$filter_) {
      MrlUtil = _MrlUtil_;
      Vpn = _Vpn_;
      $filter = _$filter_;
      matchesFeature = $filter('matchesFeature');
    });
  });

  it("should return only VPNs that match a filter with a single feature and a single value", function() {
    var vpns = [
      new Vpn.Vpn('testVpn1', [
        new Vpn.VpnFeature({'category': 'cat1', 'name': 'feat1', 'value': 'USA', 'type': 'string'}),
        new Vpn.VpnFeature({'category': 'cat2', 'name': 'feat2', 'value': 'whatever', 'type': 'string'}),
      ]),
      new Vpn.Vpn('testVpn2', [
        new Vpn.VpnFeature({'category': 'cat1', 'name': 'feat1', 'value': 'USA', 'type': 'string'}),
        new Vpn.VpnFeature({'category': 'cat2', 'name': 'feat2', 'value': 'whatever', 'type': 'string'}),
      ]),
      new Vpn.Vpn('testVpn3', [
        new Vpn.VpnFeature({'category': 'cat1', 'name': 'feat1', 'value': 'Sweden', 'type': 'string'}),
        new Vpn.VpnFeature({'category': 'cat2', 'name': 'feat2', 'value': 'whatever', 'type': 'string'}),
      ]),
    ];
    var allowedFeatureValues = { 'cat1/feat1': 'USA' };

    // expect(matchesFeature(vpns, allowedFeatureValues).length).toBe(2);
    expect(matchesFeature(vpns, allowedFeatureValues)).toContain(vpns[0]);
    expect(matchesFeature(vpns, allowedFeatureValues)).toContain(vpns[1]);
    expect(matchesFeature(vpns, allowedFeatureValues)).not.toContain(vpns[2]);
  });

  /*

  it("should return only VPNs that match a filter with a single feature and multiple values", function() {
    var vpns = [
      VpnData.Vpn('testVpn1', [
        VpnData.VpnFeature('jurisdiction', 'basedin', 'USA', 'string'),
        VpnData.VpnFeature('something', 'else', 'whatever', 'string')
      ]),
      VpnData.Vpn('testVpn2', [
        VpnData.VpnFeature('jurisdiction', 'basedin', 'USA', 'string'),
        VpnData.VpnFeature('something', 'else', 'whatever', 'string')
      ]),
      VpnData.Vpn('testVpn3', [
        VpnData.VpnFeature('jurisdiction', 'basedin', 'Sweden', 'string'),
        VpnData.VpnFeature('something', 'else', 'whatever', 'string')
      ]),
      VpnData.Vpn('testVpn4', [
        VpnData.VpnFeature('jurisdiction', 'basedin', 'Switzerland', 'string'),
        VpnData.VpnFeature('something', 'else', 'whatever', 'string')
      ]),
    ];
    var allowedFeatureValues = { 'jurisdiction/basedin': ['USA', 'Sweden'] };

    expect(vpnFeature(vpns, allowedFeatureValues).count).toBe(2);
    expect(vpnFeature(vpns, allowedFeatureValues)).toContain(vpns[0]);
    expect(vpnFeature(vpns, allowedFeatureValues)).toContain(vpns[1]);
    expect(vpnFeature(vpns, allowedFeatureValues)).toContain(vpns[2]);
    expect(vpnFeature(vpns, allowedFeatureValues)).not.toContain(vpns[3]);
  });


  it('should be able to handle complex filters', function() {
    var vpns = [
      VpnData.Vpn('testVpn1', [
        VpnData.VpnFeature('jurisdiction', 'basedin', 'USA', 'string'),
        VpnData.VpnFeature('activism', 'bitcoin', 'yes', 'boolean')
      ]),
      VpnData.Vpn('testVpn2', [
        VpnData.VpnFeature('jurisdiction', 'basedin', 'USA', 'string'),
        VpnData.VpnFeature('activism', 'bitcoin', 'no', 'boolean')
      ]),
      VpnData.Vpn('testVpn3', [
        VpnData.VpnFeature('jurisdiction', 'basedin', 'Sweden', 'string'),
        VpnData.VpnFeature('activism', 'bitcoin', 'yes', 'boolean')
      ]),
    ];
    var allowedFeatureValues = {
      'jurisdiction/basedin': 'USA',
      'activism/bitcoin': 'yes'
    };

    expect(vpnFeature(vpns, allowedFeatureValues).count).toBe(1);
    expect(vpnFeature(vpns, allowedFeatureValues)).toContain(vpns[0]);
    expect(vpnFeature(vpns, allowedFeatureValues)).not.toContain(vpns[1]);
    expect(vpnFeature(vpns, allowedFeatureValues)).not.toContain(vpns[2]);
  });
*/
});
