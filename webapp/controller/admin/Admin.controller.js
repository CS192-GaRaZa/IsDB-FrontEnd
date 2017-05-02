sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel',
  'sap/ui/core/UIComponent',
  'cmsfrontend/model/utils'
], function (
  Controller,
  JSONModel,
  UIComponent,
  utils
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
      console.log("CLICKED");
      var oButton = oEvent.getSource();
		  var bpId = oButton.data().id

		  var data = {
			  id: bpId,
			  status: 'Done'
		  };

      console.log(data);
      console.log(JSON.stringify(data));

      $.ajax({
				url: 'https://isdb-cms-api.herokuapp.com/api/v1/bank_projects/' + bpId,
				method: 'PUT',
				data: JSON.stringify(data),
				contentType: 'application/json',
				headers: {
					"Session-Key": utils.storage.get('token')
				},
				success: function(data) {
          console.log(data);
					console.log('Successfully done');
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
