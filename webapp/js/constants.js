/**Declare all app constants in this file.
 */
;(function Constants(window) {
  "use strict";

  window.appConstants = {};

  appConstants.storageKey = {
      TOKEN: "token",
      ID: "id",
      UNIQUE_ID: "unique_id",
      ROLE_KEY: "role_key"
      };

  /** Role Class definition
   *
   *  This class is used to create the objects in the globally accessible
   *  appConstants.role object. Objects created by this class are used to
   *  conveniently access properties that are specific to roles. The
   *  configuration object passed to the constructor accepts 4 arguments:
   *  -.  key -- Key used by the server to identify the role.
   *  -.  uniqueIDPrefix -- Prefix used in unique IDs,
   *                        e.g. C for consultant 12 C-12.
   *  -.  homeRoute -- Route to direct to from logging in.
   *  -.  paramGetter -- Function returning the params for the route.
   */
  function Role(oConfig) {
    this._sKey = oConfig.key;
    this._sUniqueIDPrefix = oConfig.uniqueIDPrefix;
    this._sHomeRoute = oConfig.homeRoute;
    this._fnParamGetter = oConfig.paramGetter || function () {
      var oStorageKey = appConstants.storageKey;
      return {
        id: appUtils.storage.get(oStorageKey.ID),
        roleKey: appUtils.storage.get(oStorageKey.ROLE_KEY),
        uniqueID: appUtils.storage.get(oStorageKey.UNIQUE_ID)
      };
    };
  }

  Role.prototype.getKey = function () { return this._sKey;  };

  Role.prototype.getUniqueIDPrefix = function () {
    return this._sUniqueIDPrefix;
  };

  Role.prototype.getHome = function () {
    return {
      route: this._sHomeRoute,
      parameters: this._fnParamGetter()
    };
  };

  Role.prototype.toString = function () { return this._sKey;  };
  /* --End of Role Class definition -- */


  appConstants.roleKey = {
      CONSULTANT: "consultant",
      CONSULTING_FIRM: "consulting_firm",
      VENDOR: "vendor"
      };

  appConstants.role = {};
  appConstants.role[appConstants.roleKey.CONSULTANT] = new Role({
      key: appConstants.roleKey.CONSULTANT,
      uniqueIDPrefix: "C",
      homeRoute: "consultantOverview",
      });
  appConstants.role[appConstants.roleKey.CONSULTING_FIRM] = new Role({
      key: appConstants.roleKey.CONSULTING_FIRM,
      uniqueIDPrefix: "CF",
      homeRoute: "consulting_firm_profile",
      });
  appConstants.role[appConstants.roleKey.VENDOR] = new Role({
      key: appConstants.roleKey.VENDOR,
      uniqueIDPrefix: "V",
      homeRoute: "vendorDetail"/*, "vendorOverview"*/,
      });

})(window);
