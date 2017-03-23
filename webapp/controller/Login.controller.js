sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel'
], function LoginController(
  Controller,
  JSONModel
) {
  'use strict';
  return Controller.extend('cmsfrontend.controller.Login', {

    onInit: function onInit() {
      var oLoginModel = new JSONModel({
        user: {
          email: '',
          password: ''
        }
      });

      this.getView().setModel(oLoginModel);
    },

    onPressLogOn: function onPressLogOn(oControlEvent) {
      var oLoginModel = this.getView().getModel();

      $.ajax({
        url: 'https://isdb-cms-api.herokuapp.com/api/v1/sessions/',
        method: 'POST',
        data: oLoginModel.getJSON(),
        contentType: 'application/json',
        success: function(data, textStatus, jqXHR) {
          Cookies.set('isdb', data);
        },
        error: function(xhr, status, errorThrown) {
          console.log('ERROR POSTING REQUEST');
          console.log('xhr: ', xhr);
          console.log('status: ', status);
          console.log('errorThrown: ', errorThrown);
        }
      });
    }
  });
});
