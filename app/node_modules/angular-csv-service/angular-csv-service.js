angular.module('fCsv', [])

.factory('fCsv', function() {

  var csvToJson = function(csv, separator, header) {

    if (!csv) {
      return;
    }
    separator = separator || ",";
    header = header || true;

    var result = [];
    var headers = [];
    var start = 0;

    var lines = csv.split('\n');
    var columnCount = lines[0].split(separator).length;
    if (header) {
      headers = lines[0].split(separator);
      start = 1;
    }

    for (var i = start; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(new RegExp(separator + '(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)'));
      if (currentline.length === columnCount) {
        if (header)  {
          for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
          }
        } else {
          for (var k = 0; k < currentline.length; k++) {
            obj[k] = currentline[k];
          }
        }
        result.push(obj);
      }
    }
    return JSON.stringify(result); //JavaScript object
  };

  return {
    toJson: csvToJson
  };

});
