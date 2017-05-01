sap.ui.define([
  'cmsfrontend/controller/base/Overview',
  'cmsfrontend/model/constants'
], function OverviewController(
  Overview,
  constants
) {
  "use strict";
  return Overview.extend("cmsfrontend.controller.consultingfirm.Overview", {

    constructor: function () {
      Overview.apply(this, [
        constants.roleKey.CONSULTING_FIRM,
        'consultingFirmOverview',
        'consultingFirmDetail'
      ]);
    }

  });
});
