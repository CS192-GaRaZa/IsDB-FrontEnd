sap.ui.define([
  'sap/ui/core/mvc/Controller'
], function LoginController(
  Controller
) {
  'use strict';
  return Controller.extend('cmsfrontend.controller.vendor.SignUp', {

    onInit: function onInit() {
    },

    onPressConfirm: function onPressConfirm() {
      console.log("Signed Up");
    }

  });
});
