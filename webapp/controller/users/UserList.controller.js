sap.ui.define([
  'jquery.sap.global',
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel',
  'cmsfrontend/model/utils'
], function (
  jQuery,
  Controller,
  JSONModel,
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

    onProjectTableItemPress: function (oEvent) {
      var oParams = oEvent.getParameters();
      var oProject = oParams.listItem.getBindingContext().getProperty();
    },

    onQuerySubmit: function() {
      var oModel = this.getView().getModel();
      var oQueryData = oModel.getProperty('/query');
      console.log(oQueryData);

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
