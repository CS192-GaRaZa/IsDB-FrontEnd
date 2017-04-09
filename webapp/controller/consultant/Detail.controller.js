sap.ui.define([
  'jquery.sap.global',
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel',
  'sap/ui/core/UIComponent',
], function (
  jQuery,
  Controller,
  JSONModel,
  UIComponent
) {
  "use strict";
  return Controller.extend("cmsfrontend.controller.consultant.Detail", {

    _onRouteMatched: function (oEvent) {
      var oArgs;
      var sURL;
      var oView;
      var _this;

      oArgs = oEvent.getParameter("arguments");
      this._sID = oArgs.id;
      this._sSubsection = oArgs.subsection;
      this._sUniqueID = appUtils.getUniqueID(appConstants.roleKey.CONSULTANT,
          oArgs.id);

      sURL = "https://isdb-cms-api.herokuapp.com/api/v1/users/" +
          this._sUniqueID;

      oView = this.getView();
      _this = this;
      $.ajax({
        url: sURL,
        type: "GET",
        dataType: 'json',
        contentType : "application/json",
      }).done(function (oData) {
        var sFullName = oData.surname + ", " + oData.given_name + " " +
            oData.middle_name;
        oData.full_name = sFullName;

        _this._convertDatesISOToObj(oData);
        if (!oData.image_url) {
          data.image_url = "/img/testIMG.jpg";
        }

        oView.setModel(new JSONModel(oData));
      });

      /**
      // remove all the time in the data so that we are only left with yyyy-MM-dd
      oModel.setData({
        date_of_birth:oModel.getData().date_of_birth.slice(0,10)
      }, true); **/

    },

  /**
  * Called when a controller is instantiated and its View controls (if available) are already created.
  * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
  * @memberOf cmsfrontend.profile
  */
    onInit: function(oEvent) {
      // var oUserDataLocal = {
      //     "surname": "Patron",
      //     "middle_name": "V.",
      //     "given_name": "Gabriel",
      //     "date_of_birth": "01/14/1997",
      //     "citizenship": "USA",
      //     "gender": "Male",
      //     "linkedin": "http://www.linkedin.com/in/yarimiralao",
      //     "email": "gchase.patron@gmail.com",
      //     "mobile_number": "+1283907420357",
      //     "phone_number": "+1283907420357",
      //     "skype_id": "test.skype",
      //     "description": "Yari is Vice President for Business Development of Aboitiz Power and is responsible for the company’s international expansion strategy. Prior to joining Aboitiz Power, Yari spent the last twelve years working in various roles at the AES Corporation (NYSE: AES). One of those roles included the acquisition, turnaround, and operation of the US$930 million 600-MW Masinloc coal-fired thermal power plant (largest Foreign Direct Investment in the Philippines in 2008).",
      //     "countries_of_work_experience": "USA",
      //     "website": null,
      //     "summary": null,
      //     "branches": null,
      //     "sector_list": null,
      //     "expertise_list": null,
      //     "image_url": null,
      //     "perm_street": null,
      //     "perm_city": null,
      //     "perm_zipcode": null,
      //     "perm_state": null,
      //     "perm_country": null,
      //     "mail_street": null,
      //     "mail_city": null,
      //     "mail_zipcode": null,
      //     "mail_state": null,
      //     "mail_country": null,
      //     "previously_engaged_with_isdb": null,
      //     "previous_isdb_project_details": null,
      //     "membership_license": null,
      //     "trainings": null,
      //     "languages": null,
      //     "educations": [],
      //     "employments": [],
      //     "sectors": [],
      //     "expertises": []
      //     };

      var oRouter = UIComponent.getRouterFor(this);
      oRouter.getRoute("consultantDetail")
          .attachMatched(this._onRouteMatched, this);

      var oCountriesModel = new JSONModel();
      oCountriesModel.loadData("model/countries.json");
      oCountriesModel.setSizeLimit(500);
      this.getView().setModel(oCountriesModel, "countryModel");


      // Set the initial form to be the display one
      this._showFormFragment("cmsfrontend.view.consultant.DetailDisplay");

      // adds an event delegate to the objectPage that switches it to the
          // tab that was last open in the Edit view
      this.oObjectPageLayout = this.byId("objectPageLayoutDisplay");
      this.oObjectPageLayout.addEventDelegate({
        onAfterRendering: jQuery.proxy(function () {
          //need to wait for the scrollEnablement to be active
          jQuery.sap.delayedCall(500, this.oObjectPageLayout,
                      this.oObjectPageLayout.scrollToSection,
                      [ this._sSelectedSection[0] ]);
        }, this)
      });
    },


    formatSurname: function (sLastName, sSurname, sMiddleName) {
      return sLastName + ", " + sSurname +
          (sMiddleName ? " " + sMiddleName : "");
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
      if (oEvent.getSource().getId() == "objectPageLayoutDisplay") {
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
        error: function(xhr, status) {
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
        error: function(xhr, status) {
          console.log("ERROR POSTING REQUEST");
          console.log("xhr: ", xhr);
          console.log("status: ", status);
        },
      });

    },


    handleDeletePressEducation : function (oEvent) {
      var oList = oEvent.getSource();
      var oItem = oEvent.getParameter("listItem");
      var sPath = oItem.getBindingContext().getPath();

      // since sPath returns /EmploymentData/{index} I use regEx to remove all non-integers
      var index = sPath.replace ( /[^\d.]/g, '' );

      var iId = this.getView().getModel().getData().educations[iIndex].id

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
        error: function(xhr, status) {
          console.log("ERROR POSTING REQUEST");
          console.log("xhr: ", xhr);
          console.log("status: ", status);
        },
      });
    },


    handleEditPress : function () {
      var oView = this.getView();

      //Clone the data
      this._oOldData = JSON.parse(JSON.stringify(this.getView().getModel().getData()));
      this._toggleButtonsAndView(true);

      // sets the selectedItem of the country select boxes
      if (this._sSelectedPermCountry == "") {
        oView.byId("PermCountrySelectConsultant").setSelectedKey(this.getView().getModel().getData().perm_country);
        this._sSelectedPermCountry = this.getView().getModel().getData().perm_country;
      } else {
        oView.byId("PermCountrySelectConsultant").setSelectedKey(this._sSelectedPermCountry);
      };

      if (this._sSelectedMailCountry == "") {
        oView.byId("MailCountrySelectConsultant").setSelectedKey(this.getView().getModel().getData().mail_country);
        this._sSelectedMailCountry = this.getView().getModel().getData().mail_country;
      } else {
        oView.byId("MailCountrySelectConsultant").setSelectedKey(this._sSelectedMailCountry);
      };

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
        this.oObjectPageLayoutEdit = this.getView().byId("objectPageLayoutEdit");

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

      var oView = this.getView();
      var oModel = oView.getModel();

      // handle changes to the citizenship multicombo box
      var temp = [];
      // since each item is an object, we need to get its "name" field
      for (var i = 0; i < this._selectedCitizenship.length; i++) {
        temp.push(this._selectedCitizenship[i].getText());
      };

      if (temp.length > 0){
        this.getView().getModel().setData({citizenship:temp.join(', ')}, true);
      }

      // handle changes to the countries of work experience multicombo box
      var temp = [];
      // since each item is an object, we need to get its "name" field
      for (var i = 0; i < this._selectedWorkExperience.length; i++) {
        temp.push(this._selectedWorkExperience[i].getText());
      };

      if (temp.length > 0){
        this.getView().getModel().setData({countries_of_work_experience:temp.join(', ')}, true);
      };
      
      // handle changes to the FullName element in the data
      var sFullName = oModel.getData().surname + ", " + oModel.getData().given_name + " " + oModel.getData().middle_name;
      oModel.setData({full_name:sFullName}, true);

      // handle all the changes to the select inputs
      oModel.setData({
        gender: oView.byId("genderSelect").getSelectedItem().getText(),
        previously_engaged_with_isdb: oView.byId("prevEngagedSelect")
            .getSelectedItem()
            .getText(),
        former_isdb_employee: oView.byId("formerEmployeeSelect")
            .getSelectedItem()
            .getText(),
        kind: oView.byId("kindSelect")
            .getSelectedItem()
            .getText(),
        sectors: oModel.getData().sector_list,
        expertises: oModel.getData().expertise_list,
        perm_country:this._sSelectedPermCountry,
        mail_country:this._sSelectedMailCountry
      }, true);

      var oSessionData = Cookies.getJSON("isdb");

      $.ajax({
        url : "https://isdb-cms-api.herokuapp.com/api/v1/users/" +
            this._sUniqueID,
        type : "PUT",
        headers: { "Session-Key": oSessionData.token },
        data : JSON.stringify({ user: oModel.getData() }),
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


    //Function to change the button from Edit to Cancel/Save as well as to change the view from display to edit
    _toggleButtonsAndView : function (bEdit) {
      var oView = this.getView();

      // Show the appropriate action buttons
      oView.byId("edit").setVisible(!bEdit);
      oView.byId("save").setVisible(bEdit);
      oView.byId("cancel").setVisible(bEdit);

      // Set the right form type
      this._showFormFragment(bEdit
              ? "cmsfrontend.view.consultant.DetailEdit"
              : "cmsfrontend.view.consultant.DetailDisplay");
    },

    // array of items currently selected in the Citizenship multicombo box
    _selectedCitizenship: {},

    // array of items currently selected in the Countries of work experience multicombo box
    _selectedWorkExperience: {},

    // bool that tells us if the Edit page has been initialized already.
      // Used when adding the event delegate
    _bHasEditInit: false,

    // Id of the currently selected section and the Id of the page
    _sSelectedSection: ["displayProfileSection", "objectPageLayoutDisplay"],

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
    }
  });
});

