sap.ui.define([
  'jquery.sap.global',
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel',
  'sap/ui/core/UIComponent',
  'cmsfrontend/model/utils'
], function (
  jQuery,
  Controller,
  JSONModel,
  UIComponent,
  utils
) {
  'use strict';

  var sAPIURL = 'https://isdb-cms-api.herokuapp.com/api/v1';
  var oAPI = {};
  oAPI.getUsers = function (oQuery) {
    var sURL = URI(sAPIURL)
      .segment('users')
      .query(oQuery && _.omitBy(oQuery, function (o) { return o === ''; }) ||
        {})
      .valueOf();
    return jQuery.get(sURL);
  };


  return Controller.extend('cmsfrontend.controller.users.UserList', {

    handleBanPress: function (oEvent) {
      var oButton = oEvent.getSource();
      var sId = oButton.data().id;

		  $.ajax({
				url: 'https://isdb-cms-api.herokuapp.com/api/v1/users/' + sId,
				method: 'DELETE',
				contentType: 'application/json',
				headers: {
					"Session-Key": utils.storage.get('token')
				},
				success: function() {
					console.log('Success');
					window.location.replace('/#/admin');
				},
				error: function(xhr, status, errorThrown) {
					console.log('ERROR POSTING REQUEST');
					console.log('xhr: ', xhr);
					console.log('status: ', status);
					console.log('errorThrown: ', errorThrown);
				}
			});
    },

    onInit: function () {
      var oModel = new JSONModel({
        query: {
          display_name: '',
          sector: '',
          expertise: '',
          education_course: '',
          education_degree: '',
        }
      });

      this.getView().setModel(oModel);
      this.updateUsersTable();
    },

    onUsersTableItemPress: function (oEvent) {
      var oParams = oEvent.getParameters();
      var oUser = oParams.listItem.getBindingContext().getProperty();

      var oRouter = UIComponent.getRouterFor(this);
      var sRoute;
      if (oUser.role.role_name === 'consultant') {
        sRoute = 'consultantDetail';
      } else if (oUser.role.role_name === 'consulting_firm') {
        sRoute = 'consultingFirmDetail';
      } else if (oUser.role.role_name === 'vendor') {
        sRoute = 'vendorDetail';
      }

      oRouter.navTo(sRoute, { id: oUser.id, subsection: 'profile' });
    },

    onQuerySubmit: function() {
      var oModel = this.getView().getModel();
      var oQueryData = oModel.getProperty('/query');

      this.updateUsersTable(oQueryData);
    },

    updateUsersTable: function (oQueryData) {
      var oModel = this.getView().getModel();

      oAPI.getUsers(oQueryData)
        .done(function (oData) {
          oModel.setData(_.assign(
            oModel.getProperty('/'),
            { users: oData }
          ));
        });
    }

  });
});
