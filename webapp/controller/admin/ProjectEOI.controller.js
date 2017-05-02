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
  return Controller.extend('cmsfrontend.controller.admin.ProjectEOI', {
	  onRouteMatched: function (oEvent) {
		  var oArgs = oEvent.getParameter('arguments');
		  var oModel = new JSONModel();
	      this.getView().setModel(oModel);

      console.log(oArgs.id);

		  $.ajax({
				url: 'https://isdb-cms-api.herokuapp.com/api/v1/eois/' + oArgs.id + '?status=Pending',
				method: 'GET',
				contentType: 'application/json',
				headers: {
					"Session-Key": utils.storage.get('token')
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
		  var eoiId = oButton.data().id;
      console.log(eoiId);
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
					"Session-Key": utils.storage.get('token')
				},
				success: function(data) {
					console.log('Successkjhkkkjljk');
					console.log(data);
          window.location.replace('#/admin');
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
						"Session-Key": utils.storage.get('token')
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
	  onInit: function () {
		  UIComponent.getRouterFor(this).getRoute('projectEOI').attachMatched(this.onRouteMatched, this);
	  },

    onUserNamePress: function (oEvent) {
      var oLink = oEvent.getSource();
      var sId = oLink.data().id;
      var sKind = oLink.data().kind;
      console.log(sId + " " + sKind);

      var oRouter = UIComponent.getRouterFor(this);
      var sRoute;
      if (sKind === 'consultant') {
        sRoute = 'consultantDetail';
      } else if (sKind === 'consulting_firm') {
        sRoute = 'consultingFirmDetail';
      } else if (sKind === 'vendor') {
        sRoute = 'vendorDetail';
      }

      oRouter.navTo(sRoute, { id: sId, subsection: 'profile' });
    }
  });
})
