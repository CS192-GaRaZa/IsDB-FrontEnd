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
      var sURLDone = "https://isdb-cms-api.herokuapp.com/api/v1/bank_projects?status=Done";
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

        $.get(sURLDone)
        .done(function(data) {
          oModel.setData({
            done_projects: data
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
    },
    projectDone: function (oEvent) {
      var oButton = oEvent.getSource();
		  var bpId = oButton.data().id

		  var data = {
			  id: bpId,
			  status: 'Done' 
		  };

      $.ajax({
				url: 'https://isdb-cms-api.herokuapp.com/api/v1/bank_projects/' + bpId,
				method: 'PUT',
				data: JSON.stringify(data),
				contentType: 'application/json',
				headers: {
					"Session-Key": 'DuqaP5pUbgNz4UWoc1TY9nEu'
				},
				success: function(data) {
					console.log('Successfully rejected');
					window.location.replace('/#/admin');
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
})