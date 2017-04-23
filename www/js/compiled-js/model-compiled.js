"use strict";

/**
 * Created by UTOPIA SOFTWARE on 19/04/2017.
 */

/**
 * file contains the model data of the app.
 *
 * The 'utopiasoftware.saveup' namespace has being defined in the base js file.
 *
 * The author uses the terms 'method' and function interchangeably; likewise the terms 'attribute' and 'property' are
 * also used interchangeably
 */

// define the model namespace
utopiasoftware.saveup.model = {

  /**
   * property acts as a flag that indicates that all hybrid plugins and DOM content
   * have been successfully loaded. It relies on the special device ready event triggered by the
   * intel xdk (i.e. app.Ready) to set the flag.
   *
   * @type {boolean} flag for if the hybrid plugins and DOM content are ready for execution
   */
  isAppReady: false
};

// register the event listener for when all Hybrid plugins and document DOM are ready
document.addEventListener("app.Ready", utopiasoftware.saveup.controller.appReady, false);

// listen for the initialisation of the Sign-In page
$(document).on("init", "#sign-in-page", utopiasoftware.saveup.controller.signInPageViewModel.pageInit);

//# sourceMappingURL=model-compiled.js.map