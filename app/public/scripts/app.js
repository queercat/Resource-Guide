/* app.js -- this is the primary JS in the PWA */

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDnM0KSryTB9N3vJPL2lKQYFNU7-Cn7IGE",
    authDomain: "homeless-resources.firebaseapp.com",
    databaseURL: "https://homeless-resources.firebaseio.com",
    projectId: "homeless-resources",
    storageBucket: "",
    messagingSenderId: "520409930168",
    appId: "1:520409930168:web:fab5d9f1bcf89740"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
database = firebase.database();

snapshot = null;

/**
 * @returns {Object} ... returns a snapshot of the DB, sadly must wait for promise.
 */
function reqData() {
    snapshot = database.ref('Services').once('value').then(function(snapshot) {
        return snapshot.val();
    });

    return(snapshot);
}

/**
 * @desc hiddenFigures ... Appends all of the hidden cards to needed places.
 */
function hiddenFigures() {
    $('.card').each(function() {
        object = $(this);
        // Insert Freud joke here.
        ID = object.attr('id');
    });
}

/**
 * @desc when ready starts initializing script stuff.
 */
$(document).ready(function() {
    init();
})