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
  return Controller.extend('cmsfrontend.controller.admin.AcceptedProject', {
	  onRouteMatched: function (oEvent) {
		  var oArgs = oEvent.getParameter('arguments');
		  var oModel = new JSONModel();
	      this.getView().setModel(oModel);
		  console.log('----- ', oArgs.id, '-----');

		  $.ajax({
				url: 'https://isdb-cms-api.herokuapp.com/api/v1/eois/' + oArgs.id + '?status=Accepted',
				method: 'GET',
				contentType: 'application/json',
				headers: {
					"Session-Key": 'ZR9VnnXHf7JGdj13PNxydxCa'
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
		  console.log('In AcceptedProject.controller.js')
		  UIComponent.getRouterFor(this).getRoute('acceptedProject').attachMatched(this.onRouteMatched, this);
	  }
  });
})