sap.ui.define([
  'cmsfrontend/controller/base/Overview'
], function OverviewController(
  Overview
) {
  "use strict";
  return Overview.extend("cmsfrontend.controller.consultingfirm.Overview", {

    constructor: function () {
      Overview.apply(this, [
        'consultingFirmOverview',
        'consultingFirmDetail'
      ]);
    }

  });
});
