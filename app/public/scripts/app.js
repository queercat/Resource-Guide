/* app.js -- this is the primary JS in the PWA */

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

/**
 * @desc init ... Initalies and gets everything set up.
 */
function init() {
    services = reqServices().then(function(services) {
        hiddenFigures(services);
    });
}


/**
 * @returns {Object} ... returns a snapshot of the DB, sadly must wait for promise.
 */
function reqServices() {
    services = database.ref('Services').once('value').then(function(services) {
        return services.val();
    });
    
    return services;
}

/**
 * @returns {Object} ... returns a snapshot of the DB, sadly must wait for promise.
 */
function reqInformation() {
    information = database.ref('Services-Information').once('value').then(function(information) {
        return information.val();
    });
    
    return information;
}

/**
 * @desc hiddenFigures ... Appends all of the hidden cards to needed places.
 * @var {Object} snapshot ... Snapshot of the JSON object.
 */
function hiddenFigures(snapshot) {
    $('.card').each(function() {
        object = $(this);
        // Insert Freud joke here.
        id = object.attr('id');
        category = snapshot['' + id];

        // Get the sub-group object.
        SGO = $('#'+ id + '-SG');
        
        /* Generating dynamic content! */
        SGOValue = '';
        SGOValue += '<div class="col-12">';

        for (service in category) {
            SGOValue += '<div class="card card-small" id="' + service + '"><div class="card-body text-dark"><p1>' + service + '</p1></div></div>';
        };

        SGOValue += '</div>'

        SGO.append(SGOValue);
    });
}

/**
 * @desc createModal ... Dyanmicaly create a modal!
 * @param {String} service_name ... The name of the service we're generating the modal for.
 * @param {Object} snap ... JSON object with fun data. 
 */
function createModal(service_name, snap) {
    $('#servicesProvided').text('');

    $('#serviceName').text(service_name);
    $('#serviceDescription').text(snap[service_name]['Description']);
    $('#serviceLocation').text(snap[service_name]['Location']);
    $('#servicePhoneNumber').text(snap[service_name]['Phone']);


    servicesText = '';
    
    for (var service in snap[service_name]['Services']) {
        servicesText += '<li class="list-group-item">' + service +'</li>';
    }
    $('#servicesProvided').append(servicesText);

    $('#dynamicModal').modal('show');
}

/* Listeners go here! */
$('.card').click(function() {
    object = $(this);

    id = object.attr('id');
    sub_id = id + '-SG';

    sub_object = $('#' + sub_id);

    if (sub_object.hasClass('hidden')) {
        sub_object.removeClass('hidden');
    } else {
        sub_object.addClass('hidden');
    }
});

$(document).on('click', '.card-small', function() {
    object = $(this);

    id = object.attr('id');

    information = reqInformation().then(function(info) {
        createModal(id, info);
    });
});

/**
 * @desc when ready starts initializing script stuff.
 */
$(document).ready(function() {
    init();
});