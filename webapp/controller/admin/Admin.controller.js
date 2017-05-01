sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel',
  'sap/ui/core/UIComponent'
], function (
  Controller,
  JSONModel,
  UIComponent
) {
  "use strict";
  return Controller.extend('cmsfrontend.controller.admin.Admin', {
    onInit: function() {
      var oModel = new JSONModel();
      var sURLOpen = "https://isdb-cms-api.herokuapp.com/api/v1/bank_projects?status=open";
      var sURLOngoing = "https://isdb-cms-api.herokuapp.com/api/v1/bank_projects?status=ongoing";
      this.getView().setModel(oModel);

      $.get(sURLOpen)
        .done(function(data) {
          oModel.setData({
            open_projects: data
          }, true);
          return oModel;
        })
        .then(function (model) {
          console.log(model)
        })

      $.get(sURLOngoing)
        .done(function(data) {
          oModel.setData({
            ongoing_projects: data
          }, true);
          return oModel;
        })
        .then(function (model) {
          console.log(model)
        })
    },
    goToCreateProject: function (params) {
      var oRouter = UIComponent.getRouterFor(this);
      oRouter.navTo('createProject', {}, false);
    }
  });
})