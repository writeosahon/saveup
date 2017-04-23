"use strict";

/**
 * Created by UTOPIA SOFTWARE on 20/03/2017.
 */

/**
 * file defines all View-Models, Controllers and Event Listeners used by the app
 *
 * The 'utopiasoftware.saveup' namespace has being defined in the base js file.
 * The author uses the terms 'method' and function interchangeably; likewise the terms 'attribute' and 'property' are
 * also used interchangeably
 */

// define the controller namespace
utopiasoftware.saveup.controller = {

    /**
     * method is used to handle the special event created by the intel xdk developer library. The special event (app.Ready)
     * is triggered when ALL the hybrid app pluigins have been loaded/readied and also the document DOM content is ready
     */
    appReady: function appReady() {

        // initialise the onsen library
        ons.ready(function () {
            // set the default handler for the app
            ons.setDefaultDeviceBackButtonListener(function () {
                console.log("DEFAULT BACK BUTTON LISTENER");
            });

            if (utopiasoftware.saveup.model.isAppReady === false) {
                // if app has not completed loading
                // displaying prepping message
                $('#loader-modal-message').html("Preparing App...");
                $('#loader-modal').get(0).show(); // show loader
            }

            // check if the user has previously logged in to the app
            if (!window.localStorage.getItem("app-status") || window.localStorage.getItem("app-status") == "") {
                // user has not logged in
                //set the first page to be displayed to be the login page
                $('ons-splitter').get(0).content.load("login-template");
            } else {
                // user is already logged in
                // load the main tabbar for the app
                $('ons-splitter').get(0).content.load("laundry-mart-tabbar-template");

                // enable the swipeable feature for the app splitter
                $('ons-splitter-side').attr("swipeable", true);
            }
        });

        // add listener for when the Internet network connection is offline
        document.addEventListener("offline", function () {

            // display a toast message to let user no there is no Internet connection
            window.plugins.toast.showWithOptions({
                message: "No Internet Connection. App functionality may be limited",
                duration: 4000, // 2000 ms
                position: "bottom",
                styling: {
                    opacity: 1,
                    backgroundColor: '#000000',
                    textColor: '#FFFFFF',
                    textSize: 14
                }
            });
        }, false);

        try {
            // lock the orientation of the device to 'PORTRAIT'
            screen.lockOrientation('portrait');
        } catch (err) {}

        // set status bar color
        StatusBar.backgroundColorByHexString("#000000");

        // set app ready flag to true
        utopiasoftware.saveup.model.isAppReady = true;
    },

    /**
     * object is view-model for sign-in page
     */
    signInPageViewModel: {

        /**
         * event is triggered when page is initialised
         */
        pageInit: function pageInit(event) {

            var $thisPage = $(event.target); // get the current page shown
            // find all onsen-ui input targets and insert a special class to prevent materialize-css from updating the styles
            $('ons-input input', $thisPage).addClass('utopiasoftware-no-style');

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();

            //function is used to initialise the page if the app is fully ready for execution
            function loadPageOnAppReady() {
                // check to see if onsen is ready and if all app loading has been completed
                if (!ons.isReady() || utopiasoftware.saveup.model.isAppReady === false) {
                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                    return;
                }

                // listen for the back button event
                $thisPage.get(0).onDeviceBackButton = function () {
                    ons.notification.confirm('Do you want to close the app?') // Ask for confirmation
                    .then(function (index) {
                        if (index === 1) {
                            // OK button
                            navigator.app.exitApp(); // Close the app
                        }
                    });
                };

                // hide the loader
                $('#loader-modal').get(0).hide();

                // now that the page is being shown without the loader, start the animation of the icons
                $('ons-icon.first,ons-icon.second', $thisPage).addClass('animated swing');
                // wait for 4 seconds, then stop the pulse animation of the Create Account button
                setTimeout(function () {
                    $('#login-create-account', $thisPage).removeClass('pulse');
                }, 4000);
            }
        }
    },

    /**
     * object is view-model for fixed-header page
     */
    fixedHeaderPageViewModel: {

        previousScrollPosition: 0,

        currentScrollPosition: 0,

        /**
         * event is triggered when page is initialised
         */
        pageInit: function pageInit() {

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();

            //function is used to initialise the page if the app is fully ready for execution
            function loadPageOnAppReady() {
                // check to see if onsen is ready and if all app loading has been completed
                if (!ons.isReady() || utopiasoftware.template.model.isAppReady === false) {
                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                    return;
                }

                // listen for the back button event
                var page = $('#template-navigator').get(0).topPage;
                page.onDeviceBackButton = function () {
                    ons.notification.confirm('Do you want to close the app?') // Ask for confirmation
                    .then(function (index) {
                        if (index === 1) {
                            // OK button
                            navigator.app.exitApp(); // Close the app
                        }
                    });
                };

                // add listen for the scene progress event. the listen will be used to collapse/expand the fixed header
                $('#fixed-header-page .page__content').on("scroll", utopiasoftware.template.controller.fixedHeaderPageViewModel.collapsibleHeaderHandler);
                console.log("ADDED PROGRESS LISTENER");

                utopiasoftware.template.controller.fixedHeaderPageViewModel.previousScrollPosition = 0;
                utopiasoftware.template.controller.fixedHeaderPageViewModel.currentScrollPosition = 0;
            }
        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function pageShow() {
            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();

            //function is used to initialise the page if the app is fully ready for execution
            function loadPageOnAppReady() {
                // check to see if onsen is ready and if all app loading has been completed
                if (!ons.isReady() || utopiasoftware.template.model.isAppReady === false) {
                    setTimeout(loadPageOnAppReady, 800); // call this function again after half a second
                    return;
                }

                // hide the loader
                $('#loader-modal').get(0).hide();
            }
        },

        /**
         * method is used to listen for scroll event used to collapse or expanse the fixed header
         *
         * @param event
         */
        collapsibleHeaderHandler: function collapsibleHeaderHandler(event) {
            console.log("INSIDE PROGRESS LISTENER");

            // set the current scrolltop position
            utopiasoftware.template.controller.fixedHeaderPageViewModel.currentScrollPosition = $(this).scrollTop();

            if (utopiasoftware.template.controller.fixedHeaderPageViewModel.currentScrollPosition > utopiasoftware.template.controller.fixedHeaderPageViewModel.previousScrollPosition) {
                // user scrolled down
                // set the current position as previous position
                utopiasoftware.template.controller.fixedHeaderPageViewModel.previousScrollPosition = utopiasoftware.template.controller.fixedHeaderPageViewModel.currentScrollPosition;

                // check if the collapsible header has been previously hidden. if not, hide it
                if (this.collapsibleHidden != true) {
                    // collapsible header has not been hidden
                    $('#fixed-header-1').css('display', 'none'); // hide collapsible
                    this.collapsibleHidden = true; // flag that collapsible header has been hidden
                }

                return;
            }

            if (utopiasoftware.template.controller.fixedHeaderPageViewModel.currentScrollPosition < utopiasoftware.template.controller.fixedHeaderPageViewModel.previousScrollPosition) {
                // user scrolled up
                // set the current position as previous position
                utopiasoftware.template.controller.fixedHeaderPageViewModel.previousScrollPosition = utopiasoftware.template.controller.fixedHeaderPageViewModel.currentScrollPosition;

                // check if the collapsible header has been previously shown. if not, show it
                if (this.collapsibleHidden == true) {
                    // collapsible has been hidden
                    // collapsible header has not been hidden
                    $('#fixed-header-1').css('display', 'block'); // hide collapsible
                    this.collapsibleHidden = false; // flag that collapsible header has been shown
                }

                return;
            }
        }
    },

    /**
     * object is view-model for login page
     */
    loginPageViewModel: {

        /**
         * event is triggered when page is initialised
         */
        pageInit: function pageInit() {

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();

            //function is used to initialise the page if the app is fully ready for execution
            function loadPageOnAppReady() {
                // check to see if onsen is ready and if all app loading has been completed
                if (!ons.isReady() || utopiasoftware.template.model.isAppReady === false) {
                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                    return;
                }

                // listen for the back button event
                var page = $('#template-navigator').get(0).topPage;
                page.onDeviceBackButton = function () {
                    ons.notification.confirm('Do you want to close the app?') // Ask for confirmation
                    .then(function (index) {
                        if (index === 1) {
                            // OK button
                            navigator.app.exitApp(); // Close the app
                        }
                    });
                };

                $(".log-in").click(function () {
                    $(".signIn").addClass("active-dx");
                    $(".signUp").addClass("inactive-sx");
                    $(".signUp").removeClass("active-sx");
                    $(".signIn").removeClass("inactive-dx");
                });

                $(".back").click(function () {
                    $(".signUp").addClass("active-sx");
                    $(".signIn").addClass("inactive-dx");
                    $(".signIn").removeClass("active-dx");
                    $(".signUp").removeClass("inactive-sx");
                });

                // hide the loader
                $('#loader-modal').get(0).hide();
            }
        }
    }
};

//# sourceMappingURL=controller-compiled.js.map