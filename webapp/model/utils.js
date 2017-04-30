sap.ui.define([
  'cmsfrontend/model/constants'
], function (
  constants
) {
  'use strict';

  var oUtils = {};


  oUtils.storage = {};

  oUtils.storage.set = function (sKey, anyValue) {
    Cookies.set(sKey, anyValue);
  };

  oUtils.storage.init = function (oData) {
    var oKey = constants.storageKey;
    oUtils.storage.set(oKey.TOKEN, oData.token);
    oUtils.storage.set(oKey.ID, oData.id);
    oUtils.storage.set(oKey.UNIQUE_ID, oData.unique_id);
    oUtils.storage.set(oKey.ROLE_KEY, oData.role.role_name);
  };

  oUtils.storage.get = function (sKey) {
    return Cookies.get(sKey);
  };

  oUtils.storage.clear = function () {
    var oCookies = Cookies.get();
    _.each(oCookies, function (_, sKey) {
      Cookies.remove(sKey);
    });
  };


  /** Role Class definition
   *
   *  This class is used to create the objects in the oUtils.role object.
   *  Objects created by this class are used to conveniently access properties
   *  that are specific to roles. The configuration object passed to the
   *  constructor accepts 4 arguments:
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
      var oStorageKey = constants.storageKey;
      return {
        id: oUtils.storage.get(oStorageKey.ID),
        roleKey: oUtils.storage.get(oStorageKey.ROLE_KEY),
        uniqueID: oUtils.storage.get(oStorageKey.UNIQUE_ID)
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


  oUtils.role = {};

  oUtils.role[constants.roleKey.CONSULTANT] = new Role({
      key: constants.roleKey.CONSULTANT,
      uniqueIDPrefix: "C",
      homeRoute: "consultantOverview"
      });

  oUtils.role[constants.roleKey.CONSULTING_FIRM] = new Role({
      key: constants.roleKey.CONSULTING_FIRM,
      uniqueIDPrefix: "CF",
      homeRoute: "consultingFirmOverview"
      });

  oUtils.role[constants.roleKey.VENDOR] = new Role({
      key: constants.roleKey.VENDOR,
      uniqueIDPrefix: "V",
      homeRoute: "vendorDetail"/*, "vendorOverview"*/
      });


  oUtils.getUniqueID = function (sRoleKey, sID) {
    var sPrefix;
    _.each(oUtils.role, function (oRole) {
      if (oRole.getKey() === sRoleKey) {
        sPrefix = oRole.getUniqueIDPrefix();
        return false;
      }
    });

    return sPrefix + "-" + sID;
  };


  return oUtils;
});
