;(function () {
  "use strict";
  sap.ui.getCore().attachInit(function() {
    new sap.m.Shell({
      app: new sap.ui.core.ComponentContainer({
        height : "100%",
        name : "cmsfrontend"
      }),
      appWidthLimited : false
    }).placeAt("content");
  });
})();
