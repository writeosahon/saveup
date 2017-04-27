/**
 * Created by UTOPIA SOFTWARE on 19/04/2017.
 */

/**
 * file provides the "base" framework/utilities required to launch the app. E.g. file creates the base namespace which
 * the app is built on.
 *
 * The author uses the terms 'method' and function interchangeably; likewise the terms 'attribute' and 'property' are
 * also used interchangeably
 **/

var utopiasoftware = {
    saveup : {

        validatePhoneNumber: function(phoneNumber){

            // show a loader message
            $('#phone-verification-modal .modal-message').html("Verifying Phone Number...");
            $('#phone-verification-modal').get(0).show(); // show loader

            var phoneNumberVerifiedPromise = new Promise(function(resolve, reject){
                // create a Promise object to send sms to the phoneNumber parameter
                new Promise(function(resolve2, reject2){
                    SMS.sendSMS("cdcf", "hello, raymond", resolve2, reject2);
                }).
                then(function(){
                    resolve();
                }).
                catch(function(){
                    reject();
                });
            });

            return phoneNumberVerifiedPromise;
        }
    }
};
