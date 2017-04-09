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

      var oAccountTypesModel = new JSONModel("./model/account_types.json")
          .setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
      this.getView().setModel(oAccountTypesModel, "account_types");
    },

    // TODO: Add verification for blank fields and display errors
    onSubmit: function (oControlEvent) {
      var oLoginModel = this.getView().getModel();

      $.ajax({
        url: 'https://isdb-cms-api.herokuapp.com/api/v1/sessions/',
        method: 'POST',
        data: oLoginModel.getJSON(),
        contentType: 'application/json',
        success: this._onLoginPOSTSuccess.bind(this),
        error: function(xhr, status, errorThrown) {
          console.log('ERROR POSTING REQUEST');
          console.log('xhr: ', xhr);
          console.log('status: ', status);
          console.log('errorThrown: ', errorThrown);
        }
      });
    },

    _onLoginPOSTSuccess: function (oData, sTextStatus, jqXHR) {
      var sRoleKey;
      var oContext;
      var oRouter;
      var oHomeRoute;

      // TODO: Will be removed in favor of the following function
      Cookies.set('isdb', oData);
      appUtils.storage.init(oData);

      sRoleKey = appUtils.storage.get(appConstants.storageKey.ROLE_KEY);

      oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      _.each(appConstants.role, function (oRole) {
        if (oRole.getKey() === sRoleKey) {
          oHomeRoute = oRole.getHome(oContext);
          oRouter.navTo(oHomeRoute.route, oHomeRoute.parameters);
          return false;
        }
      });
    },

    onSignUpLinkPress: function () {
      var _this = this;
      var oView = this.getView();
      var oDialog = oView.byId("idAccountTypeDialog");

      if (!oDialog) {
        var oFragmentController = {
          onPressItem: function onPressItem(oEvent) {
            oDialog.close();
            var sAccountType = oEvent.getParameter("item").getKey();
            var oRouter = sap.ui.core.UIComponent.getRouterFor(_this);
            oRouter.navTo(sAccountType + "_signup");
          },

          onPressCancel: function onPressCanel() {
            oDialog.close();
          }
        };

        oDialog = sap.ui.xmlfragment(oView.getId(),
            "cmsfrontend.view.fragments.AccountTypeDialog",
            oFragmentController);
        oView.addDependent(oDialog);
      }

      oDialog.open();
    }
  });
});
