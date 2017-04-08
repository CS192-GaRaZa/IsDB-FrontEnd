/**Declare all app constants in this file.
 */
;(function Constants(window) {
  "use strict";

  /** Role Class definition
   *
   *  This class is used to create the objects in the globally accessible
   *  appConstants.role object. Objects created by this class are used to
   *  conveniently access properties that are specific to roles.
   */
  function Role(
      sKey,             /**< Key used by the server to identify this role. */
      sUniqueIDPrefix,  /**< Prefix used in unique IDs. */
      sHomeRoute,       /**< Route to direct to from logging in. */
      fnParamGetter     /**< Function returning the params for the route. */
      ) {
    this._sKey = sKey;
    this._sUniqueIDPrefix = sUniqueIDPrefix;
    this._sHomeRoute = sHomeRoute;
    this._fnParamGetter = fnParamGetter || function (oContext) {
      return oContext;
    };
  }

  Role.prototype.getKey = function () { return this._sKey;  };
  Role.prototype.getUniqueIDPrefix = function () {
    return this._sUniqueIDPrefix;
  };
  Role.prototype.getHome = function (oContext) {
    return {
      route: this._sHomeRoute,
      parameters: this._fnParamGetter(oContext)
    };
  };
  Role.prototype.toString = function () { return this._sKey;  };
  /* --End of Role Class definition -- */


  window.appConstants = {};

  appConstants.role = {
    Consultant: new Role("consultant", "C", "consultantOverview"),
    ConsultingFirm: new Role("consulting_firm", "CF",
        "consultingFirmOverview"),
    Vendor: new Role("vendor", "V", "vendorDetail"/*, "vendorOverview"*/)
  };
})(window);
