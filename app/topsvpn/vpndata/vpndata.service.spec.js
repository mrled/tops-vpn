'use strict';

describe('vpndata', function() {
  var $httpBackend;
  var MrlUtil;
  var VpnData;

  var vpnJsonStringMock = '[{"id":"3Monkey","name":"3Monkey","features":[{"category":"activism","name":"bitcoin","type":"string","value":"No"},"bool",{"category":"activism","name":"anonpayment","type":"bool","value":false},{"category":"activism","name":"privacytoolsio","type":"bool","value":false},{"category":"affiliates","name":"fulldisclosure","type":"bool","value":""},{"category":"affiliates","name":"ethicalcopy","type":"bool","value":""},{"category":"availability","name":"connections","type":"int","value":1},{"category":"availability","name":"countries","type":"int","value":20},{"category":"availability","name":"servers","type":"int","value":325},{"category":"encryption","name":"dataweakest","type":"string","value":""},{"category":"encryption","name":"datastrongest","type":"string","value":""},{"category":"encryption","name":"handshakeweakest","type":"string","value":""},{"category":"encryption","name":"handshakestrongest","type":"string","value":""},{"category":"ethics","name":"contradictorylogging","type":"bool","value":""},{"category":"ethics","name":"claim100effective","type":"bool","value":""},{"category":"ethics","name":"spamincentive","type":"bool","value":""},{"category":"jurisdiction","name":"basedin","type":"string","value":"Switzerland"},{"category":"jurisdiction","name":"fourteeneyes","type":"string","value":"No"},{"category":"jurisdiction","name":"freedomstatus","type":"string","value":"Free"},{"category":"leakprotection","name":"dns","type":"bool","value":false},{"category":"leakprotection","name":"ipv6","type":"bool","value":false},{"category":"leakprotection","name":"killswitch","type":"bool","value":false},{"category":"logging","name":"traffic","type":"bool","value":false},{"category":"logging","name":"dns","type":"bool","value":""},{"category":"logging","name":"timestamps","type":"bool","value":true},{"category":"logging","name":"bandwidth","type":"bool","value":true},{"category":"logging","name":"ip","type":"bool","value":true},{"category":"policies","name":"forbidspam","type":"bool","value":false},{"category":"policies","name":"ethicalcopy","type":"bool","value":false},{"category":"policies","name":"fulldisclosure","type":"bool","value":false},{"category":"portblocking","name":"authsmtp","type":"bool","value":""},{"category":"portblocking","name":"p2p","type":"bool","value":""},{"category":"pricing","name":"permonth","type":"float","value":7.07},{"category":"pricing","name":"perconnectionpermonth","type":"float","value":7.07},{"category":"pricing","name":"freetrial","type":"bool","value":true},{"category":"pricing","name":"refundperiod","type":"int","value":0},{"category":"protocols","name":"openvpn","type":"bool","value":true},{"category":"website","name":"persistentcookies","type":"int","value":2},{"category":"website","name":"trackers","type":"int","value":2},{"category":"website","name":"proprietaryapis","type":"int","value":5},{"category":"website","name":"sslrating","type":"string","value":"B"},{"category":"website","name":"certcn","type":"string","value":"No SSL Cert"},{"category":"company","name":"id","type":"string","value":"3Monkey"},{"category":"company","name":"name","type":"string","value":"3Monkey"},{"category":"company","name":"url","type":"string","value":"http://www.3monkey.me/"},{"category":"company","name":"headtitle","type":"string","value":"3monkey.me | New VPN Product"},{"category":"company","name":"metadescription","type":"string","value":"The Return of Privacy. Smart VPN for everyone."},{"category":"company","name":"ogtitle","type":"string","value":"3monkey.me"},{"category":"company","name":"ogdescription","type":"string","value":"The Return of Privacy. Smart VPN for everyone."}],"metadataErrors":[]},{"id":"AceVPN","name":"AceVPN","features":[{"category":"activism","name":"bitcoin","type":"string","value":"No"},"bool",{"category":"activism","name":"anonpayment","type":"bool","value":false},{"category":"activism","name":"privacytoolsio","type":"bool","value":false},{"category":"affiliates","name":"fulldisclosure","type":"bool","value":""},{"category":"affiliates","name":"ethicalcopy","type":"bool","value":""},{"category":"availability","name":"connections","type":"int","value":2},{"category":"availability","name":"countries","type":"int","value":22},{"category":"availability","name":"servers","type":"int","value":""},{"category":"encryption","name":"dataweakest","type":"string","value":""},{"category":"encryption","name":"datastrongest","type":"string","value":""},{"category":"encryption","name":"handshakeweakest","type":"string","value":""},{"category":"encryption","name":"handshakestrongest","type":"string","value":""},{"category":"ethics","name":"contradictorylogging","type":"bool","value":true},{"category":"ethics","name":"claim100effective","type":"bool","value":true},{"category":"ethics","name":"spamincentive","type":"bool","value":""},{"category":"jurisdiction","name":"basedin","type":"string","value":"USA"},{"category":"jurisdiction","name":"fourteeneyes","type":"string","value":"Five"},{"category":"jurisdiction","name":"freedomstatus","type":"string","value":"Free"},{"category":"leakprotection","name":"dns","type":"bool","value":false},{"category":"leakprotection","name":"ipv6","type":"bool","value":false},{"category":"leakprotection","name":"killswitch","type":"bool","value":false},{"category":"logging","name":"traffic","type":"bool","value":""},{"category":"logging","name":"dns","type":"bool","value":""},{"category":"logging","name":"timestamps","type":"bool","value":true},{"category":"logging","name":"bandwidth","type":"bool","value":""},{"category":"logging","name":"ip","type":"bool","value":true},{"category":"policies","name":"forbidspam","type":"bool","value":false},{"category":"policies","name":"ethicalcopy","type":"bool","value":false},{"category":"policies","name":"fulldisclosure","type":"bool","value":false},{"category":"portblocking","name":"authsmtp","type":"bool","value":true},{"category":"portblocking","name":"p2p","type":"bool","value":"Some"},{"category":"pricing","name":"permonth","type":"float","value":4.59},{"category":"pricing","name":"perconnectionpermonth","type":"float","value":2.3},{"category":"pricing","name":"freetrial","type":"bool","value":false},{"category":"pricing","name":"refundperiod","type":"int","value":7},{"category":"protocols","name":"openvpn","type":"bool","value":true},{"category":"website","name":"persistentcookies","type":"int","value":4},{"category":"website","name":"trackers","type":"int","value":1},{"category":"website","name":"proprietaryapis","type":"int","value":10},{"category":"website","name":"sslrating","type":"string","value":"A"},{"category":"website","name":"certcn","type":"string","value":"Self"},{"category":"company","name":"id","type":"string","value":"AceVPN"},{"category":"company","name":"name","type":"string","value":"AceVPN"},{"category":"company","name":"url","type":"string","value":"http://www.acevpn.com/"},{"category":"company","name":"headtitle","type":"string","value":""},{"category":"company","name":"metadescription","type":"string"},{"category":"company","name":"ogtitle","type":"string"},{"category":"company","name":"ogdescription","type":"string"}],"metadataErrors":[]}]';
  var vpnMockCount = 2;
  var queryDeserializedJsonMock = angular.fromJson(vpnJsonStringMock);

  beforeEach(module('topsvpn'));

  beforeEach(inject(function(_$httpBackend_, _MrlUtil_, _VpnData_) {
    $httpBackend = _$httpBackend_;
    MrlUtil = _MrlUtil_;
    VpnData = _VpnData_;
    $httpBackend.expectGET('datasource/tops.vpns.min.js').respond(vpnJsonStringMock);
  }));

  // Verify that there are no outstanding expectations or requests after each test
  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it("should get the JSON data", function() {
    var deserializedJson;
    VpnData.getDeserializedJson().then(function(data){deserializedJson = data;});
    expect(deserializedJson).toEqual(undefined);
    $httpBackend.flush();
    expect(deserializedJson[0].id).toEqual(queryDeserializedJsonMock[0].id);
  });

  it('should get all VPNs', function() {
    var allVpns;
    VpnData.getVpns().then(function(data) {allVpns = data;});
    expect(allVpns).toEqual(undefined);
    $httpBackend.flush();
    expect(allVpns.length).toBe(vpnMockCount);
    expect(allVpns[0].id).toBe('3Monkey');
  });

  it("should get a single VPN by id", function() {
    var vpn;
    VpnData.getVpn("3Monkey").then(function(data) {vpn = data;});
    expect(vpn).toEqual(undefined);
    $httpBackend.flush();
    expect(vpn.id).toEqual("3Monkey");
    expect(vpn.getFeatureValue('jurisdiction', 'basedin')).toEqual("Switzerland");
    expect(vpn.getFeatureValue('protocols', 'openvpn')).toEqual(true);
    expect(MrlUtil.arrayContains(vpn.getCategoryList(), 'website')).toBe(true);
  });

  it('should map feature ids to values', function() {
    var featureIdToValueMap;
    VpnData.mapFeatureIdsToValues().then(function(data){featureIdToValueMap=data;});
    expect(featureIdToValueMap).toEqual(undefined);
    $httpBackend.flush();
    expect(featureIdToValueMap['pricing/permonth']).toEqual([7.07, 4.59]);
    expect(featureIdToValueMap['website/sslrating']).toEqual(['B', 'A']);
  });

  it('should get a single feature value set by id', function() {
    var featureIdList;
    VpnData.getFeatureValues('pricing/permonth').then(function(data){featureIdList=data;});
    expect(featureIdList).toEqual(undefined);
    $httpBackend.flush();
    expect(featureIdList).toEqual([7.07, 4.59]);
  });

  // it('should map categories to feature ids', function() {
  //   var categoryToFeatureIdMap;
  //   VpnData.mapCategoriesToFeatureIds().then(function(data){categoryToFeatureIdMap=data;});
  //   expect(categoryToFeatureIdMap).toEqual(undefined);
  //   $httpBackend.flush();
  //   expect(categoryToFeatureIdMap).toEqual(false);
  // });

  it('get a list of feature ids from a category', function() {
    var featureIds;
    VpnData.getFeatureIds('activism').then(function(data){featureIds=data;});
    expect(featureIds).toEqual(undefined);
    $httpBackend.flush();
    expect(featureIds).toEqual(['activism/bitcoin', 'activism/anonpayment', 'activism/privacytoolsio']);
  });
});
