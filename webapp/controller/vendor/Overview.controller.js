sap.ui.define([
  'cmsfrontend/controller/base/Overview'
], function OverviewController(
  Overview
) {
  "use strict";
  return Overview.extend("cmsfrontend.controller.vendor.Overview", {

    constructor: function () {
      Overview.apply(this, [
        'vendorOverview',
        'vendorDetail'
      ]);
    }

  });
});
