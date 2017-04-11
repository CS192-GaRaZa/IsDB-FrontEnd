/**Declare all app constants in this file.
 */
sap.ui.define([
], function (
) {
  "use strict";
  var oConstants = {};

  oConstants.storageKey = {
      TOKEN: "token",
      ID: "id",
      UNIQUE_ID: "unique_id",
      ROLE_KEY: "role_key"
      };

  oConstants.roleKey = {
      CONSULTANT: "consultant",
      CONSULTING_FIRM: "consulting_firm",
      VENDOR: "vendor"
      };

  oConstants.DEFAULT_PROFILE_IMAGE_URL = '/img/defaultProfileImage.jpg';

  return oConstants;
});
