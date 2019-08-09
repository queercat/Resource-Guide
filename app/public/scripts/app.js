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
        visibleFigures(services);
    });
}

/**
 * @returns {Object} ... returns a snapshot of the DB, sadly must wait for promise.
 */
function reqServices() {
    services = database.ref('Services-Information').once('value').then(function(services) {
        return services.val();
    });
    
    return services;
}

/**
 * @desc visibleServices ... Generates the cards for each service group.
 * @param {Object} services ... JSON object with every service in it. 
 */
function visibleFigures(services) {
    serviceList = traverseServices(services);

    cards = $('#cards');

    card = '';

    for (var service in serviceList) {
        serviceName = serviceList[service];

        card += '<div class="col-12">';
        card += '<div class="card" id="' + serviceName + '">';
        card += '<div class="card-body text-dark">';
        card += '<h2>' + serviceName + '</h2>';
        card += '</div>';
        card += '</div>';
        card += '<div class="container-fluid hidden" id="' + serviceName + '-SG">';
        card += '</div>';
        card += '</div>';
    }

    cards.append(card);


    hiddenFigures(services);
    $('.loading-screen').addClass('hidden');
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

        // Get the sub-group object.
        SGO = $('#' + id + '-SG');

        /* Generating dynamic content! */
        serviceList = [];
        serviceList = traverseInclude(snapshot, id);
        
        SGOValue = '';
        SGOValue += '<div class="col-12">';

        for (var service in serviceList) {

            serviceName = serviceList[service];

            SGOValue += '<div class="card card-small" id="' + serviceName + '">'
            SGOValue += '<div class="card-body text-dark">'
            SGOValue += '<p1>' + serviceName + '</p1>'
            SGOValue += '</div>'
            SGOValue += '</div>';

        };

        SGOValue += '</div>'

        SGO.append(SGOValue);
    });
}

/**
 * @description traverseInclude ... Traveses all service groups but only returns one with specific key.
 * @param {Object} services ... JSON object with each service provider. 
 */
function traverseInclude(services, key) {
    serviceList = [];
    
    for (var serviceName in services) {
        hasKey = false;
        
        for (var service in services[serviceName]['Services']) {
            if (service.replace(/ /g, '-') == key) {
                hasKey = true;
            }
        }

        if (hasKey) {
            serviceList.push(serviceName);
        }
    }

    return serviceList;
}

/**
 * @desc traverseServices ... Traverses all the service groups for each service.
 * @param {Object} services ... JSON object containing each service provider.
 * @return {Array[String]} ... Returns an array of strings for each service.
 */
function traverseServices(services) {
    servicesList = [];
    
    for (var serviceName in services) {
        for (var serviceProvided in services[serviceName]['Services']) {
            if (!servicesList.includes(serviceProvided)) {
                servicesList.push(serviceProvided.replace(/ /g, '-'));
            }
        }
    }

    return servicesList.sort();
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
        servicesText += '<li class="list-group-item">' + service + '</li>';
    }
    $('#servicesProvided').append(servicesText);

    $('#dynamicModal').modal('show');
}

/* Listeners go here! */
$(document).on('click', '.card', function() {
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

// information = reqServices().then(function(services) {
//     createModal(id, services);
// });?

/**
 * @desc when ready starts initializing script stuff.
 */
$(document).ready(function() {
    init();
});