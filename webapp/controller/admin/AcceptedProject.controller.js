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
	  onInit: function () {
		  console.log('In AcceptedProject.controller.js')
		  UIComponent.getRouterFor(this).getRoute('acceptedProject').attachMatched(this.onRouteMatched, this);
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
