sap.ui.define([
  'jquery.sap.global',
  'sap/ui/core/Fragment',
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel',
  'sap/ui/core/UIComponent',
  'sap/ui/core/routing/History',
  'cmsfrontend/model/type/CustomDate',
  'sap/ui/core/format/DateFormat',
  'cmsfrontend/model/constants',
  'cmsfrontend/model/utils'
], function VendorDetailController(
  jQuery,
  Fragment,
  Controller,
  JSONModel,
  UIComponent,
  History,
  CustomDate,
  DateFormat,
  constants,
  utils
) {
  "use strict";
  return Controller.extend("cmsfrontend.controller.vendor.Detail", {

    type: {
      Date: CustomDate
    },

    _onTitleChanged: function (oEvent) {
      var sTitle = oEvent.getParameter("title");
      var oHistory = History.getInstance();
      var sPreviousHash = oHistory.getPreviousHash();

      document.title = sTitle;
      this.getView().getModel("config").setData({
        navTitle: sTitle,
        showBackButton: sPreviousHash !== undefined
      }, true);
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
    },

    _convertDatesISOToObj: function (data) {
      data.date_of_birth = new Date(data.date_of_birth);
      data.date_cleared_consulting = new Date(data.date_cleared_consulting);
      data.vendor_establishment_date = new Date(data.vendor_establishment_date);

      var project;
      for (var i = 0; i < data.projects.length; i++) {
        project = data.projects[i];
        project.from = new Date(project.from);
        project.to = new Date(project.to);
      }

      var employment;
      for (var i = 0; i < data.employments.length; i++) {
        employment = data.employments[i];
        employment.from = new Date(employment.from);
        employment.to = new Date(employment.to);
      }
    },


    _formFragments: {},

    _sSelectedPermCountry:"",

    _sSelectedBankCountry:"",

    _getFormFragment: function (sFragmentName) {
      var oFormFragment = this._formFragments[sFragmentName];

      if (oFormFragment) {
          return oFormFragment;
      }

      oFormFragment = sap.ui.xmlfragment(this.getView().getId(),
          "cmsfrontend.view.vendor." + sFragmentName, this);

      return this._formFragments[sFragmentName] = oFormFragment;
    },


    _showFormFragment : function (sFragmentName) {
      var oPage = this.getView().byId("detailVendor");

      oPage.removeAllContent();
      oPage.insertContent(this._getFormFragment(sFragmentName));
    },


    // Id of the currently selected section and the Id of the page
    _sSelectedSection: [
      "displayVendorSection",
      "objectPageLayoutDisplayVendor"
    ],


    onInit: function (oEvent) {
      var oUserDataLocal;
      var oCountryData;
      var oCountriesModel;
      var oView;
      var sUniqueID;
      var sURL;
      var oUserData;
      var oModel;

      oUserDataLocal = {
        "vendor_name": "Vendors Anonymous",
        "vendor_type": "Aircon resellers",
        "vendor_establishment_date": null,
        "vendor_number_of_employees": "24",
        "vendor_owner": "Rafael Miguel V. Cantero",
        "vendor_manager": "Lorem Ipsum D. Lorem",
        "vendor_commercial_registration": "XXXXXXXXXXXXX",
        "email": "gchase.patron@gmail.com",
        "mobile_number": "+1283907420357",
        "phone_number": "+1283907420357",
        "skype_id": "test.skype",
        "description": "Lorem ipsum",
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
        "activities": [
            {"activity":"activity 1"},
            {"activity":"activity 2"}
        ],
        "customers": [{
            "customer_name":"Rafael Miguel F. Cantero",
            "country":"Philippines",
            "city":"Pasig"
        }],
        "projects": [{
            "name":"Project 1",
            "benefiters":"Lorem Ipsum",
            "from":null,
            "to":null,
            "contract_value":"999,999 USD"
        }],
        "contacts": [{
            "staff_name":"John S. Smith",
            "position":"Manager",
            "office_phone":"0912394123",
            "mobile_number":"09172231242",
            "email":"John@yahoo.com"
        }]
      };

      oCountriesModel = new JSONModel("model/countries.json");
      oCountriesModel.setSizeLimit(500);

      oView = this.getView();
      oView.setModel(oCountriesModel, "countryModel");

      sUniqueID = Cookies.getJSON("isdb").unique_id;
      sURL = "https://isdb-cms-api.herokuapp.com/api/v1/users/" + sUniqueID;

      oUserData = $.ajax({
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

      oModel = new JSONModel(oUserData);
      // remove all the time in the data so that we are only left
      // with yyyy-MM-dd
      // oModel.setData({
      //     date_of_birth: oModel.getData().date_of_birth.slice(0, 10)
      // }, true);

      oView.setModel(oModel);
      oView.setModel(new JSONModel(), 'config');

      UIComponent.getRouterFor(this)
        .attachTitleChanged(this._onTitleChanged, this);

      // Set the initial form to be the display one
      this._showFormFragment("DetailDisplay");

      // sets intital values for selected countries
      this._sSelectedPermCountry = oModel.getData().perm_country;
      this._sSelectedBankCountry = oModel.getData().bank_country;

      // adds an event delegate to the objectPage that switches it to the tab
      // that was last open in the Edit view
      this.oObjectPageLayout = oView.byId("objectPageLayoutDisplayVendor");
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


    // function that stores which tab the user is currently on (profile,
    // employment, etc.) so that when he switches to the edit or profile page,
    // the same tab would be open.
    trackSelectedSection : function (oEvent) {
      var sSectionId = this.byId(oEvent.getSource().getId())
        .getSelectedSection();

      // of course we don't want to save the Id of the current section
      // what we need is the Id of the corresponding section on the other
      // page (edit or display).
      if (oEvent.getSource().getId() == "objectPageLayoutDisplayVendor") {
          sSectionId = "edit" +
            sSectionId.substring(sSectionId.indexOf("display") + 7);
      } else {
          sSectionId = "display" +
            sSectionId.substring(sSectionId.indexOf("edit") + 4);
      };

      this._sSelectedSection[0] = sSectionId;
    },


    formatDate : function(v) {
         var oDateFormat = DateFormat.getDateTimeInstance({
           pattern: "dd-MM-YYYY"
         });
         return oDateFormat.format(new Date(v));
    },


    // array of items currently selected in the Citizenship multicombo box
    _selectedCitizenship: {},

    handleSelectionFinish: function(oEvent) {
        var selectedItems = oEvent.getParameter("selectedItems");
        _selectedCitizenship = selectedItems;
    },


    handleNavPress : function () {},

    handlePermCountryChange : function (oEvent){
      var selectedItem = oEvent.getParameter("selectedItem");
      this._sSelectedPermCountry = selectedItem.getText();
    },

    handleBankCountryChange : function (oEvent){
      var selectedItem = oEvent.getParameter("selectedItem");
      this._sSelectedBankCountry = selectedItem.getText();
    },


    handleDeletePressActivities : function (oEvent) {
      var oList;
      var oItem;
      var sPath;
      var iIndex;
      var iId;
      var oView;
      var oModel;
      var response = "";

      oList = oEvent.getSource();
      oItem = oEvent.getParameter("listItem");
      sPath = oItem.getBindingContext().getPath();

      // since sPath returns /EmploymentData/{index} I use regEx to remove all non-integers
      iIndex = sPath.replace ( /[^\d.]/g, '' );

      oView = this.getView();
      iId = oView.getModel().getData().activities[iIndex].id

      oModel = oView.getModel();
      oModel.getData().activities.splice(iIndex, 1);
      oModel.refresh();

      $.ajax({
        url : "https://isdb-cms-api.herokuapp.com/api/v1/activities/" + iId,
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


    handleDeletePressCustomers : function (oEvent) {
      var oList;
      var oItem;
      var sPath;
      var iIndex;
      var iId;
      var oView;
      var oModel;
      var response = "";

      oList = oEvent.getSource();
      oItem = oEvent.getParameter("listItem");
      sPath = oItem.getBindingContext().getPath();

      // since sPath returns /EmploymentData/{index} I use regEx to remove all non-integers
      iIndex = sPath.replace ( /[^\d.]/g, '' );

      oView = this.getView();
      iId = oView.getModel().getData().customers[iIndex].id

      oModel = oView.getModel();
      oModel.getData().customers.splice(iIndex, 1);
      oModel.refresh();

      $.ajax({
        url : "https://isdb-cms-api.herokuapp.com/api/v1/customers/" + iId,
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

    handleDeletePressProjects : function (oEvent) {
      var oList;
      var oItem;
      var sPath;
      var iIndex;
      var iId;
      var oView;
      var oModel;
      var response = "";

      oList = oEvent.getSource();
      oItem = oEvent.getParameter("listItem");
      sPath = oItem.getBindingContext().getPath();

      // since sPath returns /EmploymentData/{index} I use regEx to remove all non-integers
      iIndex = sPath.replace ( /[^\d.]/g, '' );

      oView = this.getView();
      iId = oView.getModel().getData().projects[iIndex].id

      oModel = oView.getModel();
      oModel.getData().projects.splice(iIndex, 1);
      oModel.refresh();

      $.ajax({
        url : "https://isdb-cms-api.herokuapp.com/api/v1/projects/" + iId,
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


    handleDeletePressContactPersons : function (oEvent) {
      var oList;
      var oItem;
      var sPath;
      var iIndex;
      var iId;
      var oView;
      var oModel;
      var response = "";

      oList = oEvent.getSource();
      oItem = oEvent.getParameter("listItem");
      sPath = oItem.getBindingContext().getPath();

      // since sPath returns /EmploymentData/{index} I use regEx to remove all non-integers
      iIndex = sPath.replace ( /[^\d.]/g, '' );

      oView = this.getView();
      iId = oView.getModel().getData().contacts[iIndex].id

      oModel = oView.getModel();
      oModel.getData().contacts.splice(iIndex, 1);
      oModel.refresh();

      $.ajax({
        url : "https://isdb-cms-api.herokuapp.com/api/v1/contacts/" + iId,
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


    // Function to change the button from Edit to Cancel/Save as well as to
    // change the view from display to edit
    _toggleButtonsAndView : function (bEdit) {
        var oView = this.getView();

        // Show the appropriate action buttons
        oView.byId("edit").setVisible(!bEdit);
        oView.byId("save").setVisible(bEdit);
        oView.byId("cancel").setVisible(bEdit);

        // Set the right form type
        this._showFormFragment(bEdit ? "DetailEdit" : "DetailDisplay");
    },

    // bool that tells us if the Edit page has been initialized already.
    // Used when adding the event delegate
    _bHasEditInit: false,

    handleEditPress : function () {
      var oView = this.getView();

      //Clone the data
      this._oOldData = JSON.parse(JSON.stringify(oView.getModel().getData()));
      this._toggleButtonsAndView(true);

      // sets the selectedItem of the country select boxes
      oView.byId("PermCountrySelectVendor").setSelectedKey(this._sSelectedPermCountry);
      oView.byId("BankCountrySelectVendor").setSelectedKey(this._sSelectedBankCountry);

      if (this._bHasEditInit == false) {
          this._bHasEditInit = true;

          // adds an event delegate to the objectPage that switches it to the
          // tab that was last open in the Display view
          this.oObjectPageLayoutEdit = oView
            .byId("objectPageLayoutEditVendor");

          this.oObjectPageLayoutEdit.addEventDelegate({
              onAfterRendering: jQuery.proxy(function () {
                  //need to wait for the scrollEnablement to be active
                  jQuery.sap.delayedCall(500, this.oObjectPageLayoutEdit,
                      this.oObjectPageLayoutEdit.scrollToSection,
                      [ this._sSelectedSection[0] ]);
              }, this)
          });
      };
    },


    handleCancelPress : function () {
        //Restore the old data
        var oModel = this.getView().getModel();
        var oData = oModel.getData();

        console.log("old data: ", this._oOldData);

        // have to turn some strings into date format again
        this._convertDatesISOToObj(this._oOldData);

        oModel.setData(this._oOldData);
        this._toggleButtonsAndView(false);
    },


    handleSavePress : function () {

      this._toggleButtonsAndView(false);

      var oView = this.getView();
      var oModel = oView.getModel();

      /** handle all the changes to the select inputs
      oModel.setData({gender:oView.byId("genderSelect").getSelectedItem().getText()}, true);
      oModel.setData({previously_engaged_with_isdb:oView.byId("prevEngagedSelect").getSelectedItem().getText()}, true);
      oModel.setData({former_isdb_employee:oView.byId("formerEmployeeSelect").getSelectedItem().getText()}, true);
      oModel.setData({kind:oView.byId("kindSelect").getSelectedItem().getText()}, true);

      oModel.setData({sectors:oModel.getData().sector_list}, true);
      oModel.setData({expertises:oModel.getData().expertise_list}, true); **/

      oModel.setData({perm_country:this._sSelectedPermCountry}, true);
      oModel.setData({bank_country:this._sSelectedBankCountry}, true);

      // change some fields in model to ints
      if (oModel.getData.vendor_number_of_employees) {
        oModel.setData({vendor_number_of_employees:oModel.getData.vendor_number_of_of_employees.parseInt()}, true);
      };

      var oSessionData = Cookies.getJSON("isdb");
      var sUniqueID = oSessionData.unique_id;

      var response=""

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

    addRowActivities : function() {
      var emptyRow = { "activity": "" };

      this.getView().getModel().getData().activities.push(emptyRow);
      this.getView().getModel().refresh();
    },


    addRowCustomers : function() {
      var emptyRow = {
        "name": "",
        "country": "",
        "city": ""
      };

      this.getView().getModel().getData().customers.push(emptyRow);
      this.getView().getModel().refresh();
    },


    addRowProjects : function() {
      var emptyRow = {
        "project_name": "",
          "benefiters": "",
          "from": null,
          "to": null,
          "contract_value": ""
      };

      this.getView().getModel().getData().projects.push(emptyRow);
      this.getView().getModel().refresh();
    },


    addRowContactPersons : function() {
      var emptyRow = {
        "name":"",
        "position":"",
        "office_phone":"",
        "mobile":"",
        "email":""
      };

      this.getView().getModel().getData().contacts.push(emptyRow);
      this.getView().getModel().refresh();
    },

    // end
  });
});
