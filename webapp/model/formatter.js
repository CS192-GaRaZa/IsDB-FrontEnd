sap.ui.define([
  'cmsfrontend/model/constants'
], function (
  constants
) {
  "use strict";
  return {

    profileImageURL: function (sImageURL) {
      return sImageURL ? sImageURL : constants.DEFAULT_PROFILE_IMAGE_URL;
    }

  };
});
