sap.ui.define([
  "jquery.sap.global",
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "cmsfrontend/model/formatter"
], function AppController(
  jQuery,
  Controller,
  JSONModel,
  formatter
) {
  "use strict";
  return Controller.extend("cmsfrontend.controller.ConIndOverview.old", {
    formatter: formatter,
    onInit: function onInit() {
      var oData = {
        sizeLimit: 3,
        individual: {
          name: "Yari Marilao",
          img: "http://localhost:40404/img/u128.jpg",
          ieoi: [
            {
              project: "Energy Generation Study Part I",
              location: "Jeddah",
              deadline: new Date(2016, 9, 28),
              budget: [59000, "USD"]
            },
            {
              project: "Energy Generation Study Part I",
              location: "Jeddah",
              deadline: new Date(2016, 9, 28),
              budget: [59000, "USD"]
            },
            {
              project: "Energy Generation Study Part I",
              location: "Jeddah",
              deadline: new Date(2016, 9, 28),
              budget: [59000, "USD"]
            },
            {
              project: "Energy Generation Study Part I",
              location: "Jeddah",
              deadline: new Date(2016, 9, 28),
              budget: [59000, "USD"]
            }
          ],
          eoi: [
            {
              project: "Energy Generation Study Part I",
              deadline: new Date(2016, 9, 28),
              submitted: new Date(2015, 10, 1),
              status: "Draft"
            },
            {
              project: "Energy Generation Study Part I",
              deadline: new Date(2016, 9, 28),
              submitted: new Date(2015, 10, 1),
              status: "Draft"
            },
            {
              project: "Energy Generation Study Part I",
              deadline: new Date(2016, 9, 28),
              submitted: new Date(2015, 10, 1),
              status: "Draft"
            },
            {
              project: "Energy Generation Study Part I",
              deadline: new Date(2016, 9, 28),
              submitted: new Date(2015, 10, 1),
              status: "Draft"
            },
            {
              project: "Energy Generation Study Part I",
              deadline: new Date(2016, 9, 28),
              submitted: new Date(2015, 10, 1),
              status: "Draft"
            },
            {
              project: "Energy Generation Study Part I",
              deadline: new Date(2016, 9, 28),
              submitted: new Date(2015, 10, 1),
              status: "Draft"
            },
          ]
        }
      };

      var oModel = new JSONModel(oData);
      oModel.setSizeLimit(oData.sizeLimit);
      this.getView().setModel(oModel, "mock");
    }
  });
});
