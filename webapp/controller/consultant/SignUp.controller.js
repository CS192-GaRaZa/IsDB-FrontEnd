sap.ui.define([
  'cmsfrontend/controller/base/SignUp',
  'sap/ui/model/json/JSONModel'
], function LoginController(
  SignUp,
  JSONModel
) {
  'use strict';
  return SignUp.extend('cmsfrontend.controller.consultant.SignUp', {
    getSignUpModel: function () {
      return new JSONModel({
        "user": {
          given_name: "",
          surname: "",
          "email": "",
          "password": "",
          "kind": "consultant",
          "role": "consultant"
        }
      });
    },

    getSignUpInputs: function () {
      return [
        oView.byId('idGivenName'),
        oView.byId('idSurname'),
        oView.byId('idEmail'),
        oView.byId('idPassword')
      ];
    }
  });
});
