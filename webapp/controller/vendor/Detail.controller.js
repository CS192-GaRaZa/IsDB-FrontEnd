sap.ui.define([
		'jquery.sap.global',
		'sap/ui/core/Fragment',
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/json/JSONModel'
	]);

sap.ui.controller("cmsfrontend.controller.vendor.Profile", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf cmsfrontend.profile
*/
	onInit: function(oEvent) {
		
		var oUserDataLocal =
		{
			    "vendor_name": "Vendors Anonymous",
			    "vendor_type": "Aircon resellers",
			    "vendor_establishment_date": "01/02/1992",
			    "vendor_number_employees": "24",
			    "vendor_owner": "Rafael Miguel V. Cantero",
			    "vendor_manager": "Lorem Ipsum D. Lorem",
			    "vendor_commercial_registration": "XXXXXXXXXXXXX",
			    "email": "gchase.patron@gmail.com",
			    "mobile_number": "+1283907420357",
			    "phone_number": "+1283907420357",
			    "skype_id": "test.skype",
			    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ut metus in odio finibus lobortis. Pellentesque venenatis velit non metus tristique auctor. Integer et sagittis nunc, non porttitor nisi. Suspendisse sodales efficitur condimentum. Phasellus quis velit posuere, semper nibh vitae, aliquet urna. Praesent porta nec est eget fringilla. Donec et diam mi.",
			    "perm_street": "XXXXXXXXXXXX",
			    "perm_city": "XXXXXXXXXXXX",
			    "perm_zipcode": "XXXXXXXXXXXX",
			    "perm_state": "XXXXXXXXXXXX",
			    "perm_country": "XXXXXXXXXXXX",
			    "vendor_membership_number": "000123",
			    "vendor_fax": "001230412",
			    "vendor_pobox": "4432",
			    "bank_name": "XXXXXXXXXXXX",
			    "bank_street": "XXXXXXXXXXXX",
			    "bank_city": "XXXXXXXXXXXX",
			    "bank_zipcode": "XXXXXXXXXXXX",
			    "bank_country": "XXXXXXXXXXXX",
			    "bank_account_holder": "Bob D. Ong",
			    "bank_account_number": "11111111",
			    "bank_swift_number": "1111111",
			    "bank_iban": "ASD1234X23ASD",
			    "activities": ["activity 1", "activity 2"],
			    "customers": [{
			    	"name":"Rafael Miguel F. Cantero",
			    	"country":"Philippines",
			    	"city":"Pasig"
			    }],
			    "projects": [{
			    	"project_name":"Project 1",
			    	"benefiters":"Lorem Ipsum",
			    	"from":"11/11/1111",
			    	"to":"11/11/1111",
			    	"contract_value":"999,999 USD"
			    }],
			    "contact_persons": [{
			    	"name":"John S. Smith",
			    	"position":"Manager",
			    	"office_phone":"0912394123",
			    	"mobile":"09172231242",
			    	"email":"John@yahoo.com"
			    }]
			  };

		var oCountryList = {"list":[
								{"countryName":"USA"},
								{"countryName":"Canada"},
								{"countryName":"Philippines"}
							]};

		var oCountryData = $.ajax({
		       url : "https://isdb-cms-api.herokuapp.com/api/v1/countries",
		       type : "GET",
		       async: false,
		       dataType: 'json',
		       contentType : "application/json",
		       success : function(data, textStatus, jqXHR) {
		    	  // console.log("data: ", data);
		    	  // console.log("textStatus: ", textStatus);
		    	  // console.log("jqxhr: ", jqXHR);
		    	  this._convertDatesISOToObj(data);
	    	  	return data;
		       }.bind(this),
		       error: function(xhr, status) {
		    	  // console.log("ERROR POSTING REQUEST");
		          // console.log("xhr: ", xhr);
		          // console.log("status: ", status);
		           return status;
		       },
		}).responseJSON;

		console.log(oCountryList);

		var oCountriesModel = new sap.ui.model.json.JSONModel(oCountryData);
		oCountriesModel.setSizeLimit(500);
		this.getView().setModel(oCountriesModel, "countryModel");

		var sUniqueID = Cookies.getJSON("isdb").unique_id;
		var sURL = "https://isdb-cms-api.herokuapp.com/api/v1/users/" + sUniqueID;

		var oUserData = $.ajax({
		       url : sURL,
		       type : "GET",
		       async: false,
		       dataType: 'json',
		       contentType : "application/json",
		       success : function(data, textStatus, jqXHR) {
		    	  // console.log("data: ", data);
		    	  // console.log("textStatus: ", textStatus);
		    	  // console.log("jqxhr: ", jqXHR);
		    	  this._convertDatesISOToObj(data);
		    	  if (!data.image_url) {
			    	  data.image_url = "/img/testIMG.jpg";
		    	  }

	    	  	return data;
		       }.bind(this),
		       error: function(xhr, status) {
		    	  // console.log("ERROR POSTING REQUEST");
		          // console.log("xhr: ", xhr);
		          // console.log("status: ", status);
		           return status;
		       },
		}).responseJSON;

		var oModel = new sap.ui.model.json.JSONModel(oUserData);

		// add a fullName field to the data
		var sFullName = oModel.getData().surname + ", " + oModel.getData().given_name + " " + oModel.getData().middle_name;
		oModel.setData({full_name:sFullName}, true);

		/**
		// remove all the time in the data so that we are only left with yyyy-MM-dd
		oModel.setData({
			date_of_birth:oModel.getData().date_of_birth.slice(0,10)
		}, true); **/

		this.getView().setModel(oModel);

		// Set the initial form to be the display one
		this._showFormFragment("DetailDisplay");

		// adds an event delegate to the objectPage that switches it to the tab that was last open in the Edit view
		this.oObjectPageLayout = this.getView().byId("objectPageLayoutDisplayVendor");
		this.oObjectPageLayout.addEventDelegate({
			onAfterRendering: jQuery.proxy(function () {
				//need to wait for the scrollEnablement to be active
				jQuery.sap.delayedCall(500, this.oObjectPageLayout, this.oObjectPageLayout.scrollToSection, [this._sSelectedSection[0]]);
			}, this)
		});


	},

	_convertDatesISOToObj: function (data) {
	  data.date_of_birth = new Date(data.date_of_birth);
	  data.date_cleared_consulting = new Date(data.date_cleared_consulting);

	  var employment;
	  for (var i = 0; i < data.employments.length; i++) {
	  	employment = data.employments[i];
	  	employment.from = new Date(employment.from);
	  	employment.to = new Date(employment.to);
	  }
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf cmsfrontend.profile
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf cmsfrontend.profile
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf cmsfrontend.profile
*/
	onExit: function() {
		for(var sPropertyName in this._formFragments) {
			if(!this._formFragments.hasOwnProperty(sPropertyName)) {
				return;
			}

			this._formFragments[sPropertyName].destroy();
			this._formFragments[sPropertyName] = null;
		}
	},

	// function that stores which tab the user is currently on (profile, employment, etc.)
	// so that when he switches to the edit or profile page, the same tab would be open.
	trackSelectedSection : function (oEvent) {

		var sSectionId = this.byId(oEvent.getSource().getId()).getSelectedSection();

		// of course we don't want to save the Id of the current section
		// what we need is the Id of the corresponding section on the other page (edit or display).
		if (oEvent.getSource().getId() == "objectPageLayoutDisplayVendor") {
			sSectionId = "edit" + sSectionId.substring(sSectionId.indexOf("display")+7);
		} else {
			sSectionId = "display" + sSectionId.substring(sSectionId.indexOf("edit")+4);
		};

		this._sSelectedSection[0] = sSectionId;

	},

	formatDate : function(v) {
	     jQuery.sap.require("sap.ui.core.format.DateFormat");
	     var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "dd-MM-YYYY"});
	     return oDateFormat.format(new Date(v));
	},

	handleSelectionFinish: function(oEvent) {
		var selectedItems = oEvent.getParameter("selectedItems");
		_selectedCitizenship = selectedItems;
	},

	handleNavPress : function () {


	},

	handleDeletePressEmployment : function (oEvent) {
		var oList = oEvent.getSource();
		var oItem = oEvent.getParameter("listItem");
		var sPath = oItem.getBindingContext().getPath();

		// since sPath returns /EmploymentData/{index} I use regEx to remove all non-integers
		var iIndex = sPath.replace ( /[^\d.]/g, '' );

		var iId = this.getView().getModel().getData().employments[iIndex].id

		this.getView().getModel().getData().employments.splice(iIndex, 1);
		this.getView().getModel().refresh();

		$.ajax({
		       url : "https://isdb-cms-api.herokuapp.com/api/v1/employments/" + iId,
		       type : "DELETE",
		       headers:{
		    	   "Session-Key": Cookies.getJSON("isdb").token
		       },
		       contentType : "application/json",
		       success : function(data, textStatus, jqXHR) {
		              response = data;
		              console.log("SUCCESS");
		              console.log("data: ", data);
		       },
		       error: function(xhr, status)
		       {
		              console.log("ERROR POSTING REQUEST");
		              console.log("xhr: ", xhr);
		              console.log("status: ", status);
		       },
		});

	},

	handleDeletePressAssignment : function (oEvent) {
		var oList = oEvent.getSource();
		var oItem = oEvent.getParameter("listItem");
		var sPath = oItem.getBindingContext().getPath();

		// since sPath returns /EmploymentData/{index} I use regEx to remove all non-integers
		var iIndex = sPath.replace ( /[^\d.]/g, '' );

		var iId = this.getView().getModel().getData().assignments[iIndex].id

		this.getView().getModel().getData().assignments.splice(iIndex, 1);
		this.getView().getModel().refresh();

		$.ajax({
		       url : "https://isdb-cms-api.herokuapp.com/api/v1/assignments/" + iId,
		       type : "DELETE",
		       headers:{
		    	   "Session-Key": Cookies.getJSON("isdb").token
		       },
		       contentType : "application/json",
		       success : function(data, textStatus, jqXHR) {
		              response = data;
		              console.log("SUCCESS");
		              console.log("data: ", data);
		       },
		       error: function(xhr, status)
		       {
		              console.log("ERROR POSTING REQUEST");
		              console.log("xhr: ", xhr);
		              console.log("status: ", status);
		       },
		});

	},

	handleDeletePressEducation : function (oEvent) {
		var oList = oEvent.getSource();
		oItem = oEvent.getParameter("listItem");
		sPath = oItem.getBindingContext().getPath();

		// since sPath returns /EmploymentData/{index} I use regEx to remove all non-integers
		index = sPath.replace ( /[^\d.]/g, '' );

		this.getView().getModel().getData().educations.splice(index, 1);
		this.getView().getModel().refresh();

		$.ajax({
		       url : "https://isdb-cms-api.herokuapp.com/api/v1/educations/" + iId,
		       type : "DELETE",
		       headers:{
		    	   "Session-Key": Cookies.getJSON("isdb").token
		       },
		       contentType : "application/json",
		       success : function(data, textStatus, jqXHR) {
		              response = data;
		              console.log("SUCCESS");
		              console.log("data: ", data);
		       },
		       error: function(xhr, status)
		       {
		              console.log("ERROR POSTING REQUEST");
		              console.log("xhr: ", xhr);
		              console.log("status: ", status);
		       },
		});

	},

	handleEditPress : function () {

		//Clone the data
		this._oOldData = JSON.parse(JSON.stringify(this.getView().getModel().getData()));
		this._toggleButtonsAndView(true);

		if (this._bHasEditInit == false){
			this._bHasEditInit = true;

			// adds an event delegate to the objectPage that switches it to the tab that was last open in the Display view
			this.oObjectPageLayoutEdit = this.getView().byId("objectPageLayoutEditVendor");

			this.oObjectPageLayoutEdit.addEventDelegate({
				onAfterRendering: jQuery.proxy(function () {
					//need to wait for the scrollEnablement to be active
					jQuery.sap.delayedCall(500, this.oObjectPageLayoutEdit, this.oObjectPageLayoutEdit.scrollToSection, [this._sSelectedSection[0]]);
				}, this)
			});
		};

	},

	handleCancelPress : function () {

		//Restore the old data
		var oModel = this.getView().getModel();
		var oData = oModel.getData();

		oModel.setData(this._oOldData);
		this._toggleButtonsAndView(false);

	},

	handleSavePress : function () {

		this._toggleButtonsAndView(false);

		var oView = this.getView();
		var oModel = oView.getModel();

		// handle changes to the citizenship multicombo box
		var temp = [];
		// since each item is an object, we need to get its "name" field
		for (var i = 0; i < _selectedCitizenship.length; i++) {
			temp.push(_selectedCitizenship[i].getText());
		};
		this.getView().getModel().setData({citizenship:temp.join(', ')}, true);

		// handle changes to the FullName element in the data
		var sFullName = oModel.getData().surname + ", " + oModel.getData().given_name + " " + oModel.getData().middle_name;
		oModel.setData({full_name:sFullName}, true);

		// handle all the changes to the select inputs
		oModel.setData({gender:oView.byId("genderSelect").getSelectedItem().getText()}, true);
		oModel.setData({previously_engaged_with_isdb:oView.byId("prevEngagedSelect").getSelectedItem().getText()}, true);
		oModel.setData({former_isdb_employee:oView.byId("formerEmployeeSelect").getSelectedItem().getText()}, true);
		oModel.setData({kind:oView.byId("kindSelect").getSelectedItem().getText()}, true);

		oModel.setData({sectors:oModel.getData().sector_list}, true);
		oModel.setData({expertises:oModel.getData().expertise_list}, true);

		var oSessionData = Cookies.getJSON("isdb");
		var sUniqueID = oSessionData.unique_id;


		$.ajax({
			url : "https://isdb-cms-api.herokuapp.com/api/v1/users/" + sUniqueID,
			type : "PUT",
			headers: { "Session-Key": oSessionData.token },
			data : JSON.stringify({ user: oModel.getData() }),
			contentType : "application/json",
			success : function(data, textStatus, jqXHR) {
				response = data;
				console.log("SUCCESS");
				console.log("data: ", data);
			},
			error: function(xhr, status) {
				console.log("ERROR POSTING REQUEST");
				console.log("xhr: ", xhr);
				console.log("status: ", status);
			},
		});
	},

	// adds an empty row to the education table
	addRowEducation : function() {
        var emptyRow = {
				degree:"",
				level:"",
				school:""
        };
		this.getView().getModel().getData().educations.push(emptyRow);
		this.getView().getModel().refresh();
    },

    // TODO: Refactor this, since it seems kind of hacked
    // The ideal scenrio is to push the uploaded image as a
    // temporary file while the user hasn't pressed save.
    // The danger with this is that when multiple users
    // change their profile pictures, the number of profile
    // images in the cloud double in size. Also, adding
    // a progress icon would be nice for responsiveness.
    onProfileImageUploaderComplete: function (oEvent) {
      var oModel = oEvent.getSource().getModel();
      var oResponseData = JSON.parse(oEvent.getParameters().response);

      oModel.setData({ image_url: oResponseData.secure_url  }, true);
    },


	// adds an empty row to the employment table
	addRowEmployment : function() {
        var emptyRow = {
				Employer:"",
				From:"",
				To:"",
				PosHeld:"",
				MainResp:""
        };
		this.getView().getModel().getData().employments.push(emptyRow);
		this.getView().getModel().refresh();
    },

    // adds an empty row to the assignments table
	addRowAssignment : function() {
        var emptyRow = {
				title:"",
				decription:"",
				role:""
        };
		this.getView().getModel().getData().assignments.push(emptyRow);
		this.getView().getModel().refresh();
    },


	//Function to change the button from Edit to Cancel/Save as well as to change the view from display to edit
	_toggleButtonsAndView : function (bEdit) {
		var oView = this.getView();

		// Show the appropriate action buttons
		oView.byId("edit").setVisible(!bEdit);
		oView.byId("save").setVisible(bEdit);
		oView.byId("cancel").setVisible(bEdit);

		// Set the right form type
		this._showFormFragment(bEdit ? "DetailEdit" : "DetailDisplay");
	},

	// array of items currently selected in the Citizenship multicombo box
	_selectedCitizenship: {},

	// bool that tells us if the Edit page has been initialized already. Used when adding the event delegate
	_bHasEditInit: false,

	// Id of the currently selected section and the Id of the page
	_sSelectedSection: ["displayVendorSection", "objectPageLayoutDisplayVendor"],

	_formFragments: {},

	_getFormFragment: function (sFragmentName) {
		var oFormFragment = this._formFragments[sFragmentName];

		if (oFormFragment) {
			return oFormFragment;
		}

		oFormFragment = sap.ui.xmlfragment(this.getView().getId(), "cmsfrontend.view.vendor." + sFragmentName, this);

		return this._formFragments[sFragmentName] = oFormFragment;
	},

	_showFormFragment : function (sFragmentName) {
		var oPage = this.getView().byId("detailVendor");

		oPage.removeAllContent();
		oPage.insertContent(this._getFormFragment(sFragmentName));

	}

});