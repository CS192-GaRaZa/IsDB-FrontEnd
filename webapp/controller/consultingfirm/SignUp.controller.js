sap.ui.define([
  'sap/ui/core/mvc/Controller',
  "sap/ui/model/json/JSONModel"
], function LoginController(
  Controller,
  JSONModel
) {
  'use strict';
  return Controller.extend('cmsfrontend.controller.consultingfirm.SignUp', {

    onInit: function onInit() {
      var oModel = new JSONModel({
        "user": {
          "cf_name": "",
          "email": "",
          "password": "",
          "kind": "consulting_firm",
          "role": "consulting_firm"
        }
      });
      this.getView().setModel(oModel);
    },

    onPressConfirm: function onPressConfirm() {
      var _this = this;
      var oModel = this.getView().getModel();

      $.ajax({
        url: 'https://isdb-cms-api.herokuapp.com/api/v1/users/',
        method: 'POST',
        data: oModel.getJSON(),
        contentType: 'application/json',
        success: _this._onSuccess.bind(_this),
        error: function(xhr, status, errorThrown) {
          console.log('ERROR POSTING REQUEST');
          console.log('xhr: ', xhr);
          console.log('status: ', status);
          console.log('errorThrown: ', errorThrown);
        }
      });
    },

    _onSuccess: function _onSuccess(data, textStatus, jqXHR) {
      var _this = this;
      var oView = this.getView();
      var oDialog = oView.byId("idAccountCreated");

      if (!oDialog) {
        var oFragmentController = {
          onPressOk: function onPressOk() {
            oDialog.close();
            var oRouter = sap.ui.core.UIComponent.getRouterFor(_this);
            oRouter.navTo("login");
          }
        };

        oDialog = sap.ui.xmlfragment(oView.getId(),
            "cmsfrontend.view.fragments.AccountCreated",
            oFragmentController);
        oView.addDependent(oDialog);
      }

      oDialog.open();
    }

  });
});
