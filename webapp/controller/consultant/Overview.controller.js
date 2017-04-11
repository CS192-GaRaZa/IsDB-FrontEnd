sap.ui.define([
  'cmsfrontend/controller/base/Overview'
], function OverviewController(
  Overview
) {
  "use strict";
  return Overview.extend("cmsfrontend.controller.consultant.Overview", {

    constructor: function () {
      Overview.apply(this, [ 'consultantOverview', 'consultantDetail' ]);
    }

  });
});
