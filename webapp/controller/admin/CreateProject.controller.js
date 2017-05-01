sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel',
  'sap/ui/core/UIComponent',
  'cmsfrontend/model/type/CustomDate',
  'cmsfrontend/model/utils'
], function (
  Controller,
  JSONModel,
  UIComponent,
  CustomDate,
  Utils
) {
  "use strict";
  return Controller.extend('cmsfrontend.controller.admin.CreateProject', {
	  type: {
		  Date: CustomDate
	  },
	  onInit: function (params) {
		  var oModel = new JSONModel({
			  project_name: '',
			  location: '',
			  selection_method: '',
			  consultant_type: '',
			  assignment_type: '',
			  work_from: '',
			  estimated_inputs: '',
			  complex: '',
			  department: '',
			  division: '',
			  budget: '',
			  team_leader: '',
			  team_members: '',
			  selection_committee_members: '',
			  publication_date: '',
			  deadline_for_submission: '',
			  status: 'open',
			  estimated_cost: ''
		  });
		  this.getView().setModel(oModel);
	  },
	  onPress: function() {
		  var json = this.getView().getModel().getJSON();
		  console.log(json);

		  $.ajax({
				url: 'https://isdb-cms-api.herokuapp.com/api/v1/bank_projects/',
				method: 'POST',
				data: json,
				contentType: 'application/json',
				headers: {
					"Session-Key": 'ZR9VnnXHf7JGdj13PNxydxCa'
				},
				success: function() {
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
	  }	  
  });
})