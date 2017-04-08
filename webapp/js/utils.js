/** Place all global utility function here
 */
;(function Utils(window) {

  window.appUtils = {};

  // appUtils.fibo = function Fibo(n) {
  //   return n === 0 || n === 1 ?
  //     1 : appUtils.fibo(n - 2) + appUtils.fibo(n - 1);
  // };

  appUtils.getUniqueID = function (sRoleKey, sID) {
    var sPrefix;
    $.each(appConstants.role, function (_, oRole) {
      if (oRole.getKey() === sRoleKey) {
        sPrefix = oRole.getUniqueIDPrefix();
        return false;
      }
    })
    return sPrefix + "-" + sID;
  }

})(window);
