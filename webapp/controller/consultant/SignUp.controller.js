sap.ui.define([
  'sap/ui/core/mvc/Controller'
], function LoginController(
  Controller
) {
  'use strict';
  return Controller.extend('cmsfrontend.controller.consultant.SignUp', {

    onInit: function onInit() {
    },

    onPressConfirm: function onPressConfirm() {
      console.log("Signed Up");
    }

  });
});
