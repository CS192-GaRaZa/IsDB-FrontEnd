sap.ui.define([
  "sap/ui/model/type/Date"
], function (
  Date
) {
  "use strict";
  return Date.extend("cmsfrontend.model.type.CustomDate", {
    constructor: function () {
      var oFormatOptions = {
          source: {
            pattern: 'yyyy-MM-dd\'T\'HH:mm:ssXXX'
            },
          pattern: 'dd-MMM-yyyy'
          };
      Date.apply(this, _.merge([ oFormatOptions ], arguments));
    }
  });
});
