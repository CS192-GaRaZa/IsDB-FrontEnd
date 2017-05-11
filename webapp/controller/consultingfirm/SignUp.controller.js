sap.ui.define([
  'cmsfrontend/controller/base/SignUp',
  'sap/ui/model/json/JSONModel'
], function LoginController(
  SignUp,
  JSONModel
) {
  'use strict';
  return SignUp.extend('cmsfrontend.controller.consultingfirm.SignUp', {
    getSignUpModel: function () {
      return new JSONModel({
        "user": {
          "cf_name": "",
          "email": "",
          "password": "",
          "kind": "consulting_firm",
          "role": "consulting_firm"
        }
      });
    },

    getSignUpInputs: function () {
      var oView = this.getView();
      return [
        oView.byId('idConsultingFirmName'),
        oView.byId('idEmail'),
        oView.byId('idPassword')
      ];
    }
  });
});

