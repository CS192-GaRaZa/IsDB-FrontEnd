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
  return Controller.extend('cmsfrontend.controller.admin.ProjectEOI', {
	  onRouteMatched: function (oEvent) {
		  var oArgs = oEvent.getParameter('arguments');
		  var oModel = new JSONModel();
		  var sURL = "https://isdb-cms-api.herokuapp.com/api/v1/eois/" + oArgs.id;
	      this.getView().setModel(oModel);

		  $.ajax({
				url: 'https://isdb-cms-api.herokuapp.com/api/v1/eois/' + oArgs.id,
				method: 'GET',
				contentType: 'application/json',
				headers: {
					"Session-Key": 'BMXbgM3tWqkhUJ2k4LiH8pwd'
				},
				success: function(data) {
					console.log('Success');
					console.log(data);
					oModel.setData({
						eoi_requests: data
					}, true);
				},
				error: function(xhr, status, errorThrown) {
					console.log('ERROR POSTING REQUEST');
					console.log('xhr: ', xhr);
					console.log('status: ', status);
					console.log('errorThrown: ', errorThrown);
				}
			});

	  },
	  acceptEoi: function (oEvent) {
		  var oButton = oEvent.getSource();
		  var eoiId = oButton.data()
		  $.ajax({
				url: 'https://isdb-cms-api.herokuapp.com/api/v1/eois/' + oArgs.id,
				method: 'PUT',
				contentType: 'application/json',
				headers: {
					"Session-Key": 'BMXbgM3tWqkhUJ2k4LiH8pwd'
				},
				success: function(data) {
					console.log('Success');
					console.log(data);
					oModel.setData({
						eoi_requests: data
					}, true);
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
		  UIComponent.getRouterFor(this).getRoute('projectEoi').attachMatched(this.onRouteMatched, this);
	  }
  });
})