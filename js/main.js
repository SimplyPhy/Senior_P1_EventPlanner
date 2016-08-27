'use strict';
/*global $:false*/

// ==========================================================================
// Pages
// ==========================================================================

var $login = $('.login'),
    $profile = $('.profile'),
    $view_events = $('.view-events'),
    $create_event = $('.create-event');

var $pages = [
  $login,
  $profile,
  $view_events,
  $create_event
];

function hidePages () {
  $.each($pages, function(i, value) {
    $(this).hide();
  });
}

function showPages () {
  $.each($pages, function(i, value) {
    $(this).show();
  });
}

// ==========================================================================
// Buttons and Navigation
// ==========================================================================

var $goto_profile_button = $('#goto_profile_button'),
    $login_button = $('#login_button'),
    $save_profile_button = $('#save_profile_button'),
    $continue_profile_button = $('#continue_profile_button'),
    $add_event_button = $('#add_event_button'),
    $create_event_button = $('#create_event_button');


$goto_profile_button.click(function() {
  $login.hide();
  $profile.show();
});

$login_button.click(function() {
  $login.hide();
  $view_events.show();
});

$save_profile_button.click(function() {
  // add action here for saving profile info, and notifying user
  // also, disable button until user changes profile info
});

$continue_profile_button.click(function() {
  $profile.hide();
  $view_events.show();
});

$add_event_button.click(function(evt) {
  // $view_events needs to be disabled here
  $create_event.show();
  evt.preventDefault();
  // need to find a way to get .create-event div above .show-events div
});

$create_event_button.click(function() {
  $create_event.hide();
});

// ==========================================================================
// Form Validation
// ==========================================================================

// email
var reqNum = new RegExp('[0-9]'),
    reqLow = new RegExp('[a-z]'),
    reqUpp = new RegExp('[A-Z]');

var $password             = $('#password'),
    $validation_length    = $('#validation_length'),
    $validation_case      = $('#validation_case'),
    $validation_uppercase = $('#validation_uppercase'),
    $validation_lowercase = $('#validation_lowercase'),
    $validation_number    = $('#validation_number');

$password.on('focus', function(evt) {
  $password.css('background', 'hsl(120, 96%, 90%)');
});

$password.on('blur', function(evt) {
  $password.css('background', 'hsl(359, 96%, 90%)');
});

$password.on('input', function(evt) {

});




// call on page load
hidePages();
$login.show();