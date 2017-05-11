sap.ui.define([
  'sap/ui/core/mvc/Controller',
  "sap/ui/model/json/JSONModel",
  'sap/m/MessageBox',
  'cmsfrontend/model/type/Email'
], function LoginController(
  Controller,
  JSONModel,
  MessageBox,
  Email
) {
  'use strict';
  return Controller.extend('cmsfrontend.controller.base.SignUp', {

    type: {
      Email: Email
    },

    onInit: function onInit() {
      var oModel = this.getSignUpModel();
      this.getView().setModel(oModel);

      // attach handlers for validation errors
      sap.ui.getCore().attachValidationError(function (evt) {
        var control = evt.getParameter("element");
        if (control && control.setValueState) {
          control.setValueState("Error");
        }
      });

      sap.ui.getCore().attachValidationSuccess(function (evt) {
        var control = evt.getParameter("element");
        if (control && control.setValueState) {
          control.setValueState("None");
        }
      });
    },

    onPressConfirm: function onPressConfirm() {
      var _this = this;
      var oView = this.getView();
      var oModel = oView.getModel();
      var aInputs = this.getSignUpInputs();

      _.each(aInputs, function (input) {
        if (!input.getValue()) {
          input.setValueState('Error');
        }
      });

      var bCanContinue = true;
      _.each(aInputs, function (input) {
        if (input.getValueState() === 'Error') {
          bCanContinue = false;
          return false;
        }
      })

      if (bCanContinue) {
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
      } else {
        MessageBox.alert('Fix invalid input fields.');
      }
    },

    _onSuccess: function _onSuccess(data, textStatus, jqXHR) {
      var _this = this;
      var oView = this.getView();
      var oDialog = oView.byId("idAccountCreated");

      if (!oDialog) {
        var oFragmentController = {
          onPressOk: function onPressOk() {
            oDialog.close();
            // var oRouter = sap.ui.core.UIComponent.getRouterFor(_this);
            // oRouter.navTo("login");
            window.location.replace('/');
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
