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
      sKey,           /**< Key used by the server to identify this role. */
      sHomeRoute,     /**< Route to direct to from logging in. */
      fnParamGetter   /**< Function returning the parameters for the route. */
      ) {
    this._sKey = sKey;
    this._sHomeRoute = sHomeRoute;
    this._fnParamGetter = fnParamGetter || function (oContext) {
      return oContext;
    };
  }

  Role.prototype.getKey = function () { return this._sKey;  };
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
    Conultant: new Role("consultant", "consultantOverview"),
    ConsultingFirm: new Role("consulting_firm", "consultingFirmOverview"),
    Vendor: new Role("vendor", "vendorDetail"/*, "vendorOverview"*/)
  };
})(window);
