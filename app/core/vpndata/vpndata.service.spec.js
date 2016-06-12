'use strict';

describe('core.vpndata', function() {
  var $httpBackend;
  var Vpn;
  var rootScope;
  var deferred;

  var vpnsCsvMock =
    '"VPN SERVICE","JURISDICTION Based In (Country)","JURISDICTION Fourteen Eyes?","JURISDICTION Freedom Status","LOGGING Logs Traffic","LOGGING Logs DNS Requests","LOGGING Logs Timestamps","LOGGING Logs Bandwidth","LOGGING Logs IP Address","ACTIVISM Anonymous Payment Method","ACTIVISM Accepts Bitcoin","ACTIVISM Meets PrivacyTools IO Criteria","LEAK PROTECTION 1st Party DNS Servers","LEAK PROTECTION IPv6 Supported / Blocked","LEAK PROTECTION Kill Switch","PROTOCOLS Offers OpenVPN","PORT BLOCKING Auth SMTP","PORT BLOCKING P2P","SECURITY Weakest Data Encryption","SECURITY Strongest Data Encryption","SECURITY Weakest Handshake Encryption","SECURITY Strongest Handshake Encryption","AVAILABILITY # of Connections","AVAILABILITY # of Countries","AVAILABILITY # of Servers","WEBSITE # of Persistent Cookies","WEBSITE # of External Trackers","WEBSITE # of Proprietary APIs","WEBSITE Server SSL Rating","WEBSITE SSL Cert issued to","PRICING $ / Month (Annual Pricing)","PRICING $ / Connection / Month","PRICING Free Trial","PRICING Refund Period (Days)","ETHICS Contradictory Logging Policies","ETHICS Falsely Claims 100% Effective","ETHICS Incentivizes Social Media Spam","POLICIES Forbids Spam","POLICIES Requires Ethical Copy","POLICIES Requires Full Disclosure","AFFILIATES Practice Ethical Copy","AFFILIATES Give Full Disclosure"`\r`\n' +
    '"3Monkey","Switzerland","No","Free","No","","Yes","Yes","Yes","No","No","No","No","No","No","Yes","","","","","","","1","20","325","2","2","5","B","No SSL Cert","7.07","7.07","Yes","0","","","","No","No","No","",""\r\n' +
    '"AceVPN","USA","Five","Free","","","Yes","","Yes","No","No","No","No","No","No","Yes","Yes","Some","","","","","2","22","","4","1","10","A","Self","4.59","2.30","No","7","Yes","Yes","","No","No","No","",""\r\n' +
    '"ActiVPN","France","Nine","Free","","","","","","Email","Yes","No","No","No","No","Yes","","","","","","","5","13","20","0","0","0","A+","Self","3.34","0.67","No","","","","","No","No","No","",""\r\n' +
    '"AirVPN","Italy","Fourteen","Free","No","","","","","Email","Yes","Yes","Yes","No","Yes","Yes","No","No","AES-256","AES-256","RSA-4096","RSA-4096","3","16","138","3","0","0","A+","Self","4.93","1.64","Yes","3","","","","No","No","No","No","No"\r\n';

  beforeEach(module('core.vpndata'));

  beforeEach(inject(function(_$httpBackend_, _Vpn_) {
    $httpBackend = _$httpBackend_;
    Vpn = _Vpn_;
    $httpBackend.expectGET('/vpns/tops.vpns.csv').respond(vpnsCsvMock);
  }));

  // Verify that there are no outstanding expectations or requests after each test
  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it("should get raw CSV data", function() {
    var rawCsvString;
    Vpn.queryRawCsv().then(function(data) {rawCsvString = data;});
    expect(rawCsvString).toEqual(undefined);
    $httpBackend.flush();
    expect(rawCsvString.substring(0,100)).toEqual(vpnsCsvMock.substring(0,100));
  });

  it("should convert the CSV string into JS objects", function() {
    var rawCsvObj;
    Vpn.queryRawVpnObjs().then(function(data) {rawCsvObj = data;});
    expect(rawCsvObj).toEqual(undefined);
    $httpBackend.flush();
    expect(rawCsvObj[0]['VPN SERVICE']).toEqual('3Monkey');
  });

  it("should get a single VPN by id", function() {
    var vpn;
    Vpn.get("3Monkey").then(function(data) {vpn = data;});
    expect(vpn).toEqual(undefined);
    $httpBackend.flush();
    expect(vpn.id).toEqual("3Monkey");
    expect(vpn.getFeatureValue('jurisdiction', 'basedin')).toEqual("Switzerland");
    expect(vpn.getFeatureValue('protocols', 'openvpn')).toEqual(true);
    expect(arrayContains(vpn.getCategoryList(), 'website')).toBe(true);
  });

});
