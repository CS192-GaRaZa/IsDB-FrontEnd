/** Place all global utility function here
 */
;(function Utils(window) {

  window.appUtils = {};

  // appUtils.fibo = function Fibo(n) {
  //   return n === 0 || n === 1 ?
  //     1 : appUtils.fibo(n - 2) + appUtils.fibo(n - 1);
  // };

  appUtils.storage = {};

  appUtils.storage.set = function (sKey, anyValue) {
    Cookies.set(sKey, anyValue);
  };

  appUtils.storage.init = function (oData) {
    var oKey = appConstants.storageKey;
    appUtils.storage.set(oKey.TOKEN, oData.token);
    appUtils.storage.set(oKey.ID, oData.id);
    appUtils.storage.set(oKey.UNIQUE_ID, oData.unique_id);
    appUtils.storage.set(oKey.ROLE_KEY, oData.role.role_name);
  };

  appUtils.storage.get = function (sKey) {
    return Cookies.get(sKey);
  };

  appUtils.storage.clear = function () {
    var oCookies = Cookies.get();
    _.each(oCookies, function (_, sKey) {
      Cookies.remove(sKey);
    });
  };

  appUtils.getUniqueID = function (sRoleKey, sID) {
    var sPrefix;
    _.each(appConstants.role, function (oRole) {
      if (oRole.getKey() === sRoleKey) {
        sPrefix = oRole.getUniqueIDPrefix();
        return false;
      }
    })
    return sPrefix + "-" + sID;
  };

})(window);
