;(function () {
  "use strict";

  sap.ui.getCore().attachInit(function() {

    jQuery.sap.includeStyleSheet('css/style.css');

    new sap.ui.core.ComponentContainer({
      height : "100%",
      name : "cmsfrontend"
    }).placeAt("content");
  });
})();
