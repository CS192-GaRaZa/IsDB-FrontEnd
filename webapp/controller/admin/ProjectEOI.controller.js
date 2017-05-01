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
	      this.getView().setModel(oModel);

		  $.ajax({
				url: 'https://isdb-cms-api.herokuapp.com/api/v1/eois/' + oArgs.id + '?status=Pending',
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
	  acceptEoi: function (oEvent) {
		  var oButton = oEvent.getSource();
		  var eoiId = oButton.data().id
		  var data = {
			  id: eoiId,
			  status: 'Accepted' 
		  };

		  console.log(JSON.stringify(data))
		  $.ajax({
				url: 'https://isdb-cms-api.herokuapp.com/api/v1/eois/' + eoiId,
				method: 'PUT',
				data: JSON.stringify(data),
				contentType: 'application/json',
				headers: {
					"Session-Key": 'ZR9VnnXHf7JGdj13PNxydxCa'
				},
				success: function(data) {
					console.log('Success');
					return data;
				},
				error: function(xhr, status, errorThrown) {
					console.log('ERROR POSTING REQUEST');
					console.log('xhr: ', xhr);
					console.log('status: ', status);
					console.log('errorThrown: ', errorThrown);
				}
			})
			.then(function setProjectToOngoing(data) {
				console.log('Now in setProjectToOngoing');
				console.log(data);
				var bankProjectId = data.bank_project.id;
				console.log(bankProjectId);

				var data = {
					id: bankProjectId,
					status: 'ongoing'
				}

				$.ajax({
					url: 'https://isdb-cms-api.herokuapp.com/api/v1/bank_projects/' + bankProjectId,
					method: 'PUT',
					data: JSON.stringify(data),
					contentType: 'application/json',
					headers: {
						"Session-Key": 'ZR9VnnXHf7JGdj13PNxydxCa'
					},
					success: function(data) {
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
			});
	  },
	  rejectEoi: function (oEvent) {
		  var oButton = oEvent.getSource();
		  var eoiId = oButton.data().id
		  console.log(eoiId)
		  var data = {
			  id: eoiId,
			  status: 'Rejected' 
		  };

		  console.log(JSON.stringify(data))
		  $.ajax({
				url: 'https://isdb-cms-api.herokuapp.com/api/v1/eois/' + eoiId,
				method: 'PUT',
				data: JSON.stringify(data),
				contentType: 'application/json',
				headers: {
					"Session-Key": 'yw9dqi7VExWqjmfEuaFaFsPj'
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
	  },
	  onInit: function () {
		  UIComponent.getRouterFor(this).getRoute('projectEOI').attachMatched(this.onRouteMatched, this);
	  }
  });
})