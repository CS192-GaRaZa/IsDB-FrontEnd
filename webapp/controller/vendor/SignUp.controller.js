sap.ui.define([
  'cmsfrontend/controller/base/SignUp',
  'sap/ui/model/json/JSONModel'
], function LoginController(
  SignUp,
  JSONModel
) {
  'use strict';
  return SignUp.extend('cmsfrontend.controller.vendor.SignUp', {
    getSignUpModel: function () {
      return new JSONModel({
        "user": {
          "vendor_name": "",
          "email": "",
          "password": "",
          "kind": "vendor",
          "role": "vendor"
        }
      });
    },

    getSignUpInputs: function () {
      var oView = this.getView();
      return [
        oView.byId('idVendorName'),
        oView.byId('idEmail'),
        oView.byId('idPassword')
      ];
    }
  });
});

