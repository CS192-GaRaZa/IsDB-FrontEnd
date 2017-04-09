sap.ui.define([
    'jquery.sap.global',
    'sap/ui/core/Fragment',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel'
  ]);

sap.ui.controller("cmsfrontend.controller.Profile1", {

    _getSessionData: function () {
      return Cookies.getJSON("isdb");
    },

    _convertDatesISOToObj: function (data) {
      var experience;
      for (var i = 0; i < data.experiences.length; i++) {
        experience = data.experiences[i];
        experience.from = new Date(experience.from);
        experience.to = new Date(experience.to);
      }
    },
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf cmsfrontend.profile
*/
  onInit: function(oEvent) {


    var oUserDataLocal = {
          "email": "bluebiz@email.com",
          "mobile_number": "+10183979233837",
          "phone_number": "+1283907420357",
          "skype_id": "bluebiz.info",
          "description": null,
          "countries_of_work_experience": "USA",
          "vendor_name": null,
          "vendor_country": null,
          "vendor_constitution_year": null,
          "vendor_avg_annual_turnover": null,
          "vendor_number_of_employees": null,
          "vendor_representative": null,
          "vendor_scope_of_business": null,
          "vendor_main_clients": null,
          "rating": null,
          "status": null,
          "cf_name": "BlueBiz Consulting Ltd.",
          "cf_acronym": "BCL",
          "cf_country": "USA",
          "cf_type_of_business": "Development Consulting",
          "cf_number_of_employees": "24",
          "cf_avg_annual_turnover": "999,999 USD",
          "website": "www.bluebiz.com",
          "summary": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ut metus in odio finibus lobortis. Pellentesque venenatis velit non metus tristique auctor. Integer et sagittis nunc, non porttitor nisi. Suspendisse sodales efficitur condimentum. Phasellus quis velit posuere, semper nibh vitae, aliquet urna. Praesent porta nec est eget fringilla. Donec et diam mi.",
          "branches": "Philippines, Canada",
          "sector_list": "XXXXXXXX XXXXXXXX\nXXXXXXXX XXXXXXXX\nXXXXX",
          "expertise_list": "XXXXXXXXX XXXXXXXXXX XXXXXXXXX\nXXXXXXXXX XXXXXXXXXX XXXXXXXXX",
          "sector_ids": [],
          "expertise_ids": [],
          "addresses": [],
          "educations": [],
          "employments": [],
          "sectors": [],
          "expertises": []
        };

    var sUniqueID = this._getSessionData().unique_id;
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
            return data;

           },
           error: function(xhr, status)
           {
            // console.log("ERROR POSTING REQUEST");
              // console.log("xhr: ", xhr);
              // console.log("status: ", status);
               return status;
           },
    }).responseJSON;

    var oModel = new sap.ui.model.json.JSONModel(oUserData);

    this.getView().setModel(oModel);

    // Set the initial form to be the display one
    this._showFormFragment("Profile1Display");

    // adds an event delegate to the objectPage that switches it to the tab that was last open in the Edit view
    this.oObjectPageLayout = this.getView().byId("objectPageLayoutDisplay1");
    this.oObjectPageLayout.addEventDelegate({
      onAfterRendering: jQuery.proxy(function () {
        //need to wait for the scrollEnablement to be active
        jQuery.sap.delayedCall(500, this.oObjectPageLayout, this.oObjectPageLayout.scrollToSection, [this._sSelectedSection[0]]);
      }, this)
    });
  },

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf cmsfrontend.profile
*/
//  onBeforeRendering: function() {
//
//  },

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf cmsfrontend.profile
*/
//  onAfterRendering: function() {
//
//  },

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
    if (oEvent.getSource().getId() == "objectPageLayoutDisplay1") {
      sSectionId = "edit" + sSectionId.substring(sSectionId.indexOf("display")+7);
    } else {
      sSectionId = "display" + sSectionId.substring(sSectionId.indexOf("edit")+4);
    };

    this._sSelectedSection[0] = sSectionId;

  },

  handleNavPress : function () {
  },

  formatDate : function(v) {
       jQuery.sap.require("sap.ui.core.format.DateFormat");
       var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "dd-MM-YYYY"});
       return oDateFormat.format(new Date(v));
  },

  handleDeletePressExperience : function (oEvent) {
    var oList = oEvent.getSource();
    oItem = oEvent.getParameter("listItem");
    sPath = oItem.getBindingContext().getPath();

    // since sPath returns /EmploymentData/{index} I use regEx to remove all non-integers
    index = sPath.replace ( /[^\d.]/g, '' );

    this.getView().getModel().getData().experiences.splice(index, 1);
    this.getView().getModel().refresh();

    $.ajax({
           url : "https://isdb-cms-api.herokuapp.com/api/v1/experiences/" + iId,
           type : "DELETE",
           headers:{
             "Session-Key": this._getSessionData().token
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
           }
    });
  },

  handleEditPress : function () {

    //Clone the data
    this._oOldData = JSON.parse(JSON.stringify(this.getView().getModel().getData()));
    this._toggleButtonsAndView(true);

    if (this._bHasEditInit == false){
      this._bHasEditInit = true;

      // adds an event delegate to the objectPage that switches it to the tab that was last open in the Display view
      this.oObjectPageLayoutEdit = this.getView().byId("objectPageLayoutEdit1");

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

    // have to turn some strings into date format again
    this._convertDatesISOToObj(this._oOldData);

    oModel.setData(this._oOldData);
    this._toggleButtonsAndView(false);

  },

  handleSavePress : function () {

    this._toggleButtonsAndView(false);

    this.getView().getModel().setData({sectors:this.getView().getModel().getData().sector_list}, true);
    this.getView().getModel().setData({expertises:this.getView().getModel().getData().expertise_list}, true);

    var oSendData = {
        "user":this.getView().getModel().getData()
      };

      var oSessionData = this._getSessionData();
      var sUniqueID = oSessionData.unique_id;
      var sToken = oSessionData.token;
      var sURL = "https://isdb-cms-api.herokuapp.com/api/v1/users/"
          + sUniqueID;

      $.ajax({
             url : sURL,
             type : "PUT",
             headers:{
               "Session-Key": sToken
             },
             data : JSON.stringify(oSendData),
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

  // adds an empty row to the experience table
  addRowExperience : function() {
        var emptyRow = {
        Client:"",
        Project:"",
        Country:"",
        Role:"",
        From:"",
        To:"",
        Value:"",
        };
    this.getView().getModel().getData().experiences.push(emptyRow);
    this.getView().getModel().refresh();
    },


  //Function to change the button from Edit to Cancel/Save as well as to change the view from display to edit
  _toggleButtonsAndView : function (bEdit) {
    var oView = this.getView();

    // Show the appropriate action buttons
    oView.byId("edit1").setVisible(!bEdit);
    oView.byId("save1").setVisible(bEdit);
    oView.byId("cancel1").setVisible(bEdit);

    // Set the right form type
    this._showFormFragment(bEdit ? "Profile1Edit" : "Profile1Display");
  },

  // bool that tells us if the Edit page has been initialized already. Used when adding the event delegate
  _bHasEditInit: false,

  // Id of the currently selected section and the Id of the page
  _sSelectedSection: ["displayProfileSection1", "objectPageLayoutDisplay1"],

  _formFragments: {},

  _getFormFragment: function (sFragmentName) {
    var oFormFragment = this._formFragments[sFragmentName];

    if (oFormFragment) {
      return oFormFragment;
    }

    oFormFragment = sap.ui.xmlfragment(this.getView().getId(), "cmsfrontend.view.fragments." + sFragmentName, this);

    return this._formFragments[sFragmentName] = oFormFragment;
  },

  _showFormFragment : function (sFragmentName) {
    var oPage = this.getView().byId("profile1");

    oPage.removeAllContent();
    oPage.insertContent(this._getFormFragment(sFragmentName));
  }

});
