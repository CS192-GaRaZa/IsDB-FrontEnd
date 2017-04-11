sap.ui.define([
], function (
) {
  "use strict";
  return {

    profileImageURL: function (sImageURL) {
      return sImageURL ? sImageURL : appConstants.DEFAULT_PROFILE_IMAGE_URL;
    }

  };
});
