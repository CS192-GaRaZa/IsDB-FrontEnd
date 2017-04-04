sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel"
], function OverviewController(
  Controller,
  JSONModel
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

    onInit: function () {
      var iSizeLimit = 3;

      var oConfigModel = new JSONModel({
        size_limit: iSizeLimit
      });
      this.getView().setModel(oConfigModel, "config");

      var oModel = new JSONModel({
        nieos: this._getDummyIEOs(),
        ieos: this._getDummyIEOs()
      });
      var sUniqueID = Cookies.getJSON("isdb").unique_id;

      oModel.loadData("https://isdb-cms-api.herokuapp.com/api/v1/users/" + sUniqueID,
          {}, true, 'GET', true);
      oModel.setSizeLimit(iSizeLimit);
      this.getView().setModel(oModel);
    }

  });
});
