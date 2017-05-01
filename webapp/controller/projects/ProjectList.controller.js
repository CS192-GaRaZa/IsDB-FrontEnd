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
  oAPI.getProjects = function (oQuery) {
    var sURL = URI(sAPIURL)
      .segment('bank_projects')
      .query(oQuery && _.omitBy(oQuery, function (o) { return o === ''; }) ||
        {})
      .valueOf();
    return jQuery.get(sURL);
  };


  return Controller.extend('cmsfrontend.controller.projects.ProjectList', {

    onInit: function () {
      var oModel = new JSONModel({
        query: {
          project_name: '',
          location: '',
          selection_method: '',
          work_from: '',
          assignment_type: '',
          consultant_type: '',
          department: '',
          division: ''
        }
      });

      this.getView().setModel(oModel);
      this.updateProjectsTable();
    },

    onProjectTableItemPress: function (oEvent) {
      var oParams = oEvent.getParameters();
      var oProject = oParams.listItem.getBindingContext().getProperty();
    },

    onQuerySubmit: function() {
      var oModel = this.getView().getModel();
      var oQueryData = oModel.getProperty('/query');

      this.updateProjectsTable(oQueryData);
    },

    updateProjectsTable: function (oQueryData) {
      var oModel = this.getView().getModel();

      oAPI.getProjects(oQueryData)
        .done(function (oData) {
          oModel.setData(_.assign(
            oModel.getProperty('/'),
            { projects: oData }
          ));
        });
    }

  });
});
