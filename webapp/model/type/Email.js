sap.ui.define([
  'sap/ui/model/SimpleType',
  'sap/ui/model/ValidateException'
], function (
  SimpleType,
  ValidateException
) {
  "use strict";

  return SimpleType.extend("cmsfrontend.model.type.Email", {
    formatValue: function (oValue) {
      return oValue;
    },

    parseValue: function (oValue) {
      return oValue;
    },

    validateValue: function (oValue) {
      var mailregex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!oValue.match(mailregex)) {
        throw new ValidateException("'" + oValue +
            "' is not a valid email address");
      }
    }
  });
});
