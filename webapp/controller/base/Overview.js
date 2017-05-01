sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/core/routing/History',
  'sap/ui/core/UIComponent',
  'sap/ui/model/json/JSONModel',
  'cmsfrontend/model/type/CustomDate',
  'cmsfrontend/model/formatter',
  'cmsfrontend/model/constants',
  'cmsfrontend/model/utils'
], function (
  Controller,
  History,
  UIComponent,
  JSONModel,
  CustomDate,
  formatter,
  constants,
  utils
) {
  "use strict";
  return Controller.extend('cmsfrontend.controller.base.Overview', {

    type: {
      Date: CustomDate
    },

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
      var oArgs = oEvent.getParameter('arguments');
      this._sId = oArgs.id;

      var sUniqueId = utils.getUniqueID(this._sRole, this._sId);
      var sEndPoint = "https://isdb-cms-api.herokuapp.com/api/v1/users/" +
        sUniqueId;

      var oModel = new JSONModel();
      oModel.loadData(sEndPoint, {}, true, 'GET', true);

      $.ajax({
        url : 'https://isdb-cms-api.herokuapp.com/api/v1/eois',
        type : 'GET',
        headers: {
         "Session-Key": utils.storage.get('token')
        },
        contentType : "application/json"
      }).done(function (oData) {
        console.log(oData);
        oModel.setData({ eois: oData }, true);
      });

      oModel.setSizeLimit(this._iTableSizeLimit);
      var oView = this.getView();
      oView.setModel(oModel);
    },

    constructor: function (sRole, sOverviewRoute, sDetailRoute) {
      this._sOverviewRoute = sOverviewRoute;
      this._sDetailRoute = sDetailRoute;
      this._sRole = sRole;
    },

    formatter: _.merge({
      tableFooter: function (oList, iSizeLimit) {
        var oI18NModel = this.getView().getModel('i18n');
        var oBundle = oI18NModel.getResourceBundle();
        return oBundle.getText('TableFooter', [ iSizeLimit, oList.length ]);
      }
    }, formatter),

    onInit: function () {
      var oRouter = UIComponent.getRouterFor(this);
      oRouter.getRoute(this._sOverviewRoute)
          .attachMatched(this._onRouteMatched, this);

      var oConfigModel = new JSONModel({
        size_limit: this._iTableSizeLimit
      });
      this.getView().setModel(oConfigModel, "config");
      oRouter.attachTitleChanged(this._onTitleChanged, this);
    },

    onNameLinkPress: function (oEvent) {
      var oRouter = UIComponent.getRouterFor(this);
      oRouter.navTo(this._sDetailRoute, {
        id: this._sId,
        subsection: "profile"
      }, false);
    },

    onLogOutPress: function (oEvent) {
      var oRouter;
      var sPattern;

      utils.storage.clear();
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
        sRoleKey = utils.storage.get(constants.storageKey.ROLE_KEY);
        oRole = constants.role[sRoleKey];
        oHomeRoute = oRole.getHome();
        oRouter = UIComponent.getRouterFor(this);
        oRouter.navTo(oHomeRoute.route, oHomeRoute.parameters, true);
      }
    }
  });
});
