'use strict';

angular.
  module('core.vpn').
  factory('Vpn', ['$http', '$q', 'fCsv',
    function($http, $q, fCsv) {

      var deferredRawCsvString = $q.defer(),
          deferredRawJsonString = $q.defer(),
          deferredRawJsonCache = $q.defer(),
          deferredVpnList = $q.defer();

      $http.get('/vpns/tops.vpns.csv').then(function(response) {
        deferredRawCsvString.resolve(response.data);
        deferredRawJsonString.resolve(fCsv.toJson(response.data));
        deferredRawJsonCache.resolve(angular.fromJson(deferredRawJsonString));
        console.log("shit got resolved bih");
      });

      deferredRawCsvString.promise.then(function(response){console.log(`drcs resolved in service w data ${response}`);});



      // $http.get('/vpns/tops.vpns.csv').then(function(resp) {

        // self.rawCsvStringCache = resp.data;
        // self.rawJsonStringCache = fCsv.toJson(self.rawCsvStringCache);
        // self.rawJsonCache = angular.fromJson(self.rawJsonStringCache);

        // for (var csvRow in self.rawJsonCache) {
        //
        //    // Normalize the VPN name so it can be easily used in a URL
        //    //var vpnId = csvRow['VPN SERVICE'].replace(/ /g, '').replace(/\//g, '');
        //
        //    self.vpnCache += [{
        //      // Normalize the VPN name so it can be easily used in a URL
        //      //'id': vpnId,
        //      'name': csvRow['VPN SERVICE'],
        //      'activism': {
        //        'bitcoin': csvRow['ACTIVISM Accepts Bitcoin'],
        //        'anonymous_payment': csvRow['ACTIVISM Anonymous Payment Method'],
        //        'privacytoolsio': csvRow['ACTIVISM Meets PrivacyTools IO Criteria']
        //      },
        //      'affiliates': {
        //        'fulldisclosure': csvRow['AFFILIATES Give Full Disclosure'],
        //        'ethicalcopy': csvRow['AFFILIATES Practice Ethical Copy']
        //      }
        //    }];
        //  }

      // });

      return {
        'get': function(vpnId) {
          // function vpnFilterById(vpnEntry) {
          //   if (vpnEntry.id == vpnId) {return true;} else {return false;}
          // }
          // var foundVpn = (self.vpnCache.filter(vpnFilterById))[0];
          // return foundVpn;
          return null;
        },
        'queryRawCsv': function() {return deferredRawCsvString.promise;},
        'queryRawJsonString': function() {return deferredRawJsonString.promise;}
        // 'query': function() {
        //   return self.vpnCache;
        // }
      };
    }
  ]);
