'use strict';

describe('core.vpn', function() {
  var Vpn;

  var csvRowMock = {
    "VPN SERVICE": "Test / Example VPNService",
    "ACTIVISM Anonymous Payment Method": "",
    "ACTIVISM Accepts Bitcoin": "false",
    "ACTIVISM Meets PrivacyTools IO Criteria": "false",
    "AFFILIATES Practice Ethical Copy": "",
    "AFFILIATES Give Full Disclosure": "",
    "AVAILABILITY # of Connections": "3",
    "AVAILABILITY # of Countries": "1",
    "AVAILABILITY # of Servers": "25",
    "ETHICS Contradictory Logging Policies": "true",
    "ETHICS Falsely Claims 100% Effective": "false",
    "ETHICS Incentivizes Social Media Spam": "true",
    "JURISDICTION Based In (Country)": "Atlantis",
    "JURISDICTION Fourteen Eyes?": "37",
    "JURISDICTION Freedom Status": "Unfree",
    "LEAK PROTECTION 1st Party DNS Servers": "true",
    "LEAK PROTECTION IPv6 Supported / Blocked": "false",
    "LEAK PROTECTION Kill Switch": "true",
    "LOGGING Logs Traffic": "false",
    "LOGGING Logs DNS Requests": "true",
    "LOGGING Logs Timestamps": "false",
    "LOGGING Logs Bandwidth": "true",
    "LOGGING Logs IP Address": "false",
    "POLICIES Forbids Spam": "true",
    "POLICIES Requires Ethical Copy": "",
    "POLICIES Requires Full Disclosure": "",
    "PORT BLOCKING Auth SMTP": "",
    "PORT BLOCKING P2P": "some",
    "PRICING $ / Month (Annual Pricing)": "9.75",
    "PRICING $ / Connection / Month": "3.25",
    "PRICING Free Trial": "false",
    "PRICING Refund Period (Days)": "7",
    "PROTOCOLS Offers OpenVPN": "true",
    "SECURITY Weakest Data Encryption": "AES-128",
    "SECURITY Strongest Data Encryption": "AES-256",
    "SECURITY Weakest Handshake Encryption": "RSA-2048",
    "SECURITY Strongest Handshake Encryption": "RSA-2048",
    "WEBSITE # of Persistent Cookies": "8",
    "WEBSITE # of External Trackers": "2",
    "WEBSITE # of Proprietary APIs": "12",
    "WEBSITE Server SSL Rating": "C",
    "WEBSITE SSL Cert issued to": "Self"
  };

  // +1 because the service name gets parsed into 2 features: name and id
  var parsedFeatureCount = Object.keys(csvRowMock).length +1;

  beforeEach(module('core.vpn'));

  beforeEach(inject(function(_Vpn_) {
    Vpn = _Vpn_;
  }));

  it("should make one feature for each CSV row", function() {
    var vpn = Vpn.Vpn(csvRowMock);
    expect(vpn.features.length).toBe(parsedFeatureCount);
  });

  it("should put the correct value in each feature", function() {
    var vpn = Vpn.Vpn(csvRowMock);
    expect(vpn.getFeatureValue('company', 'name')).toBe(csvRowMock["VPN SERVICE"]);
    expect(vpn.getFeatureValue('encryption', 'datastrongest')).toBe(csvRowMock["SECURITY Strongest Data Encryption"]);
    expect(vpn.getFeatureValue('protocols', 'openvpn')).toBe(true);
    expect(vpn.getFeatureValue('portblocking', 'authsmtp')).toBe("");
    expect(vpn.getFeatureValue('pricing', 'permonth')).toBe(9.75);
    expect(vpn.getFeatureValue('affiliates', 'fulldisclosure')).toBe("");
    expect(vpn.getFeatureValue('affiliates', 'fulldisclosure', 'UNDEFINED')).toBe("");
    expect(vpn.getFeatureValue('nonexistent', 'nonexistent')).toBe(undefined);
    expect(vpn.getFeatureValue('nonexistent', 'nonexistent', 'UNDEFINED')).toBe("UNDEFINED");
  });
});
