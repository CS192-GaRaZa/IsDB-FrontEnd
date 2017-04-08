sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/UIComponent"
], function OverviewController(
  Controller,
  JSONModel,
  UIComponent
) {
  "use strict";
  return Controller.extend("cmsfrontend.controller.consultant.Overview", {

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

    formatTableFooterText: function (oList, iSizeLimit) {
      return "Showing " + iSizeLimit + " of " + oList.length;
    },

    _iTableSizeLimit: 3,

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
      oModel.loadData(sEndPoint, {}, true, 'GET', true);
      oModel.setSizeLimit(this._iTableSizeLimit);
      this.getView().setModel(oModel);
    },

    onInit: function () {
      var oRouter;
      var oConfigModel;
      var oView;
      var oModel;

      oRouter = UIComponent.getRouterFor(this);
      oRouter.getRoute("consultantOverview")
          .attachMatched(this._onRouteMatched, this);

      oConfigModel = new JSONModel({ size_limit: this._iTableSizeLimit });
      oView = this.getView();
      oView.setModel(oConfigModel, "config");
    },

    onNameLinkPress: function (oEvent) {
      var oRouter = UIComponent.getRouterFor(this);
      oRouter.navTo("consultantDetail", {
        id: this._sID,
        subsection: "profile"
      });
    }
  });
});
