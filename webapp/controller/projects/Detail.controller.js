sap.ui.define([
  'jquery.sap.global',
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel',
  'sap/ui/core/UIComponent',
  'sap/ui/core/routing/History',
  'sap/m/MessageToast',
  'cmsfrontend/model/type/CustomDate',
  'cmsfrontend/model/formatter',
  'cmsfrontend/model/constants',
  'cmsfrontend/model/utils'
], function (
  jQuery,
  Controller,
  JSONModel,
  UIComponent,
  History,
  MessageToast,
  CustomDate,
  formatter,
  constants,
  utils
) {
  'use strict';

  var oType = {
    Date: CustomDate
  };

  return Controller.extend('cmsfrontend.controller.projects.Detail', {

    type: oType,

    formatter: _.merge({
      fullname: function (sLastName, sSurname, sMiddleName) {
        return sLastName + ", " + sSurname +
            (sMiddleName ? " " + sMiddleName : "");
      }
    }, formatter),

    _onTitleChanged: function (oEvent) {
      var sTitle = oEvent.getParameter("title");
      var oHistory = History.getInstance();
      var sPreviousHash = oHistory.getPreviousHash();

      document.title = sTitle;
      this.getView().getModel('config').setData({
        navTitle: sTitle,
        showBackButton: sPreviousHash !== undefined
      }, true);
    },

    _onRouteMatched: function (oEvent) {
      var oArgs = oEvent.getParameter('arguments');
      this._sId = oArgs.id;

      var sURL = 'http://isdb-cms-api.herokuapp.com/api/v1/bank_projects/' +
          this._sId;

      this.getView().setModel(new JSONModel(sURL));
    },

  /**
  * Called when a controller is instantiated and its View controls (if available) are already created.
  * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
  * @memberOf cmsfrontend.profile
  */
    onInit: function(oEvent) {
      var oRouter = UIComponent.getRouterFor(this);
      oRouter.getRoute('projectDetail')
          .attachMatched(this._onRouteMatched, this);

      var oConfigModel = new JSONModel();
      var oView = this.getView();
      oView.setModel(oConfigModel, 'config');
      oRouter.attachTitleChanged(this._onTitleChanged, this);

      var oCountriesModel = new JSONModel();
      oCountriesModel.loadData('model/countries.json');
      oCountriesModel.setSizeLimit(500);
      oView.setModel(oCountriesModel, 'countryModel');


      // Set the initial form to be the display one
      this._showFormFragment('cmsfrontend.view.projects.DetailDisplay');

      // adds an event delegate to the objectPage that switches it to the
          // tab that was last open in the Edit view
      this.oObjectPageLayout = this.byId('projectDisplay');
      this.oObjectPageLayout.addEventDelegate({
        onAfterRendering: jQuery.proxy(function () {
          //need to wait for the scrollEnablement to be active
          jQuery.sap.delayedCall(500, this.oObjectPageLayout,
                      this.oObjectPageLayout.scrollToSection,
                      [ this._sSelectedSection[0] ]);
        }, this)
      });
    },

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
      if (oEvent.getSource().getId() == "projectDisplay") {
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


    handleSelectionFinishCitizenship: function(oEvent) {
      var selectedItems = oEvent.getParameter("selectedItems");
      this._selectedCitizenship = selectedItems;
    },

    handleSelectionFinishWorkExperience: function(oEvent) {
      var selectedItems = oEvent.getParameter("selectedItems");
      this._selectedWorkExperience = selectedItems;
    },

    handleNavPress : function () {
    },

    handlePermCountryChange : function (oEvent){
      var selectedItem = oEvent.getParameter("selectedItem");
      this._sSelectedPermCountry = selectedItem.getText();
    },

    handleMailCountryChange : function (oEvent){
      var selectedItem = oEvent.getParameter("selectedItem");
      this._sSelectedMailCountry = selectedItem.getText();
    },

    handleEditPress : function () {

      var oView = this.getView();
      var oModel = oView.getModel();

      console.log(oModel.getData());

      //Clone the data
      this._oOldData = JSON.parse(JSON.stringify(this.getView().getModel().getData()));
      this._toggleButtonsAndView(true);


      /**
      console.log("SC", this._selectedCitizenship)

      if (this._selectedCitizenship == {}) {
        oView.byId("CitizenshipComboBox").setSelectedKeys(this.getView().getModel().getData().citizenship);
        this._sSelectedMailCountry = this.getView().getModel().getData().citizenship;
      } else {
        oView.byId("MailCountrySelectConsultant").setSelectedKey(this._sSelectedMailCountry);
      }; **/


      if (this._bHasEditInit == false){
        this._bHasEditInit = true;

        // adds an event delegate to the objectPage that switches it to the tab that was last open in the Display view
        this.oprojectEdit = this.getView().byId("projectEdit");

        this.oprojectEdit.addEventDelegate({
          onAfterRendering: jQuery.proxy(function () {
            //need to wait for the scrollEnablement to be active
            jQuery.sap.delayedCall(500, this.oprojectEdit, this.oprojectEdit.scrollToSection, [this._sSelectedSection[0]]);
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

      var oSessionData = Cookies.getJSON("isdb");
      var response=""

      $.ajax({
        url : "http://isdb-cms-api.herokuapp.com/api/v1/bank_projects/" +
          this._sId,
        type : "PUT",
        headers: { "Session-Key": utils.storage.get('token') }, // THIS SESSION KEY IS HARDCODED//////////////////////
        data : JSON.stringify(oModel.getData()),
        contentType : "application/json",
        success : function(data, textStatus, jqXHR) {
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

    handleEOIPress : function (oEvent) {

      var oView = this.getView();
      var oModel = oView.getModel();
      var oButton = oEvent.getSource();
      var sId = oButton.data().id;

      console.log(sId);


      var send = {
        "bank_project_id": sId,
        "status": "Pending"
      };

      console.log(send);

      $.ajax({
        url : "http://isdb-cms-api.herokuapp.com/api/v1/eois",
        type : "POST",
        headers: { "Session-Key": utils.storage.get('token') }, // THIS SESSION KEY IS HARDCODED/////////////////////////////
        data : JSON.stringify(send),
        contentType : "application/json",
        success : function(data, textStatus, jqXHR) {
          console.log("SUCCESS");
          console.log("data: ", data);
          MessageToast.show('Successfully sent EOI');
        },
        error: function(xhr, status) {
          console.log("ERROR POSTING REQUEST");
          console.log("xhr: ", xhr);
          console.log("status: ", status);
          MessageToast.show('Failed to send EOI');
        },
      });
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

    // adds an empty row to the education table
    addRowEducation : function() {
      var emptyRow = {
        degree: "",
        level: "",
        school: ""
      };

      this.getView().getModel().getData().educations.push(emptyRow);
      this.getView().getModel().refresh();
    },

    // adds an empty row to the employment table
    addRowEmployment : function() {
      var emptyRow = {
        Employer: "",
        From: "",
        To: "",
        PosHeld: "",
        MainResp: ""
      };

      this.getView().getModel().getData().employments.push(emptyRow);
      this.getView().getModel().refresh();
    },

    // adds an empty row to the assignments table
    addRowAssignment : function() {
      var emptyRow = {
        title: "",
        decription: "",
        role: ""
      };

      this.getView().getModel().getData().assignments.push(emptyRow);
      this.getView().getModel().refresh();
    },

    // adds an empty row to the references table
    addRowReferences : function() {
      var emptyRow = {
        first_name: "",
        last_name: "",
        organization: "",
        position: "",
        email: "",
        telephone: ""
      };

      this.getView().getModel().getData().references.push(emptyRow);
      this.getView().getModel().refresh();
    },

    // adds an empty row to the publications table
    addRowPublications : function() {
      var emptyRow = {
        first_name: "",
        last_name: "",
        organization: "",
        position: "",
        email: "",
        telephone: ""
      };

      this.getView().getModel().getData().publications.push(emptyRow);
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
      this._showFormFragment(bEdit
              ? "cmsfrontend.view.projects.DetailEdit"
              : "cmsfrontend.view.projects.DetailDisplay");
    },

    // array of items currently selected in the Citizenship multicombo box
    _selectedCitizenship: {},

    // array of items currently selected in the Countries of work experience multicombo box
    _selectedWorkExperience: {},

    // bool that tells us if the Edit page has been initialized already.
      // Used when adding the event delegate
    _bHasEditInit: false,

    // Id of the currently selected section and the Id of the page
    _sSelectedSection: ["displayProfileSection", "projectDisplay"],

    _sSelectedPermCountry:"",

    _sSelectedMailCountry:"",

    _formFragments: {},

    _getFormFragment: function (sFragmentName) {
      var oFormFragment = this._formFragments[sFragmentName];

      if (oFormFragment) {
        return oFormFragment;
      }

      oFormFragment = sap.ui.xmlfragment(this.getView().getId(),
              sFragmentName, this);

      return this._formFragments[sFragmentName] = oFormFragment;
    },

    _showFormFragment : function (sFragmentName) {
      var oPage = this.getView().byId("profile");

      oPage.removeAllContent();
          var oFragment = this._getFormFragment(sFragmentName);
      oPage.addContent(oFragment);
    },

    onNavBackPress: function (oEvent) {
      var oHistory = History.getInstance();
      var sPreviousHash = oHistory.getPreviousHash();

      if (sPreviousHash !== undefined) {
        window.history.go(-1);
      } else {
        var sRoleKey = utils.storage.get(constants.storageKey.ROLE_KEY);
        var oRole = constants.role[sRoleKey];
        var oHomeRoute = oRole.getHome();
        var oRouter = UIComponent.getRouterFor(this);
        oRouter.navTo(oHomeRoute.route, oHomeRoute.parameters, true);
      }
    },

    onLogOutPress: function (oEvent) {
      var oRouter;
      var sPattern;

      utils.storage.clear();
      oRouter = UIComponent.getRouterFor(this);
      sPattern = oRouter.getRoute("login").getPattern();
      window.location.replace(sPattern);
    }
  });
});
