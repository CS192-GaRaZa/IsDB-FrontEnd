sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/core/routing/History',
  'sap/ui/core/UIComponent',
  'sap/ui/model/json/JSONModel',
  'cmsfrontend/model/formatter'
], function (
  Controller,
  History,
  UIComponent,
  JSONModel,
  formatter
) {
  "use strict";
  return Controller.extend('cmsfrontend.controller.base.Overview', {

    _getDummyIEOs: function () {
      return [
          {
            "project": "Energy Generation Study Part 1",
            "location": "Jeddah",
            "deadline": new Date(2017, 5, 21),
            "budget": [59000, "USD"],
            "submitted": new Date(2017, 6, 22),
            "status": "Draft"
          },
          {
            "project": "Feasibility Study for Angkor Dam",
            "location": "Jeddah",
            "deadline": new Date(2017, 9, 12),
            "budget": [110000, "USD"],
            "submitted": new Date(2017, 10, 21),
            "status": "Withdrawn"

          },
          {
            "project": "Computerized HR Systems for HQ",
            "location": "Jeddah",
            "deadline": new Date(2017, 11, 27),
            "budget": [59000, "USD"],
            "submitted": new Date(2018, 0, 13),
            "status": "Submitted"
          },
          {
            "project": "Energy Generation Study Part 2",
            "location": "Jeddah",
            "deadline": new Date(2017, 9, 21),
            "budget": [59000, "USD"],
            "submitted": new Date(2017, 11, 22),
            "status": "Draft"
          },
          {
            "project": "Feasibility Study for Angkor Dam II",
            "location": "Jeddah",
            "deadline": new Date(2017, 11, 12),
            "budget": [110000, "USD"],
            "submitted": new Date(2018, 2, 21),
            "status": "Withdrawn"

          },
          {
            "project": "Computerized HR Systems for HQ II",
            "location": "Jeddah",
            "deadline": new Date(2018, 5, 27),
            "budget": [59000, "USD"],
            "submitted": new Date(2018, 6, 13),
            "status": "Submitted"
          }
      ];
    },

    _iTableSizeLimit: 3,

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

    _onRouteMatched: function (oEvent) {
      var oArgs;
      var sUniqueID;
      var sEndPoint;
      var oModel;

      oArgs = oEvent.getParameter("arguments");
      this._sID = oArgs.id;
      sUniqueID = appUtils.getUniqueID(appConstants.roleKey.CONSULTANT,
          oArgs.id);
      sEndPoint = "https://isdb-cms-api.herokuapp.com/api/v1/users/" +
          sUniqueID;

      oModel = new JSONModel({
        nieos: this._getDummyIEOs(),
        ieos: this._getDummyIEOs()
      });

      $.ajax({
        url: sEndPoint,
        method: 'GET'
      }).done(function (oData) {
        // if (!oData.image_url) {
        //   oData['image_url'] = "/img/testIMG.jpg";
        // }
        oModel.setData(oData, true);
      });

      oModel.setSizeLimit(this._iTableSizeLimit);
      this.getView().setModel(oModel);
    },

    constructor: function (sOverviewRoute, sDetailRoute) {
      this._sOverviewRoute = sOverviewRoute;
      this._sDetailRoute = sDetailRoute;
    },

    formatter: formatter,

    onInit: function () {
      var oRouter;
      var oConfigModel;
      var oView;

      oRouter = UIComponent.getRouterFor(this);
      oRouter.getRoute(this._sOverviewRoute)
          .attachMatched(this._onRouteMatched, this);

      oConfigModel = new JSONModel({
        size_limit: this._iTableSizeLimit
      });
      oView = this.getView();
      oView.setModel(oConfigModel, "config");
      oRouter.attachTitleChanged(this._onTitleChanged, this);
    },

    onNameLinkPress: function (oEvent) {
      var oRouter = UIComponent.getRouterFor(this);
      oRouter.navTo(this._sDetailRoute, {
        id: this._sID,
        subsection: "profile"
      }, false);
    },

    onLogOutPress: function (oEvent) {
      var oRouter;
      var sPattern;

      appUtils.storage.clear();
      oRouter = UIComponent.getRouterFor(this);
      sPattern = oRouter.getRoute("login").getPattern();
      window.location.replace(sPattern);
    },

    onNavBackPress: function (oEvent) {
      var oHistory;
      var sPreviousHash;
      var oHomeRoute;
      var oRouter;
      var sRoleKey;
      var oRole;

      oHistory = History.getInstance();
      sPreviousHash = oHistory.getPreviousHash();

      if (sPreviousHash !== undefined) {
        window.history.go(-1);
      } else {
        sRoleKey = appUtils.storage.get(appConstants.storageKey.ROLE_KEY);
        oRole = appConstants.role[sRoleKey];
        oHomeRoute = oRole.getHome();
        oRouter = UIComponent.getRouterFor(this);
        oRouter.navTo(oHomeRoute.route, oHomeRoute.parameters, true);
      }
    },

    formatTableFooterText: function (oList, iSizeLimit) {
      return "Showing " + iSizeLimit + " of " + oList.length;
    }

  });
});
