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

/* Variable Assignments
=====================================*/

// Bools
var first_focus = true;

// RegEx
var reqNum    = new RegExp('[0-9]'),
    reqLow    = new RegExp('[a-z]'),
    reqUpp    = new RegExp('[A-Z]'),
    reqEmail  = new RegExp('^\S+@\S+[\.][0-9a-z]+$');

// Password Requirements
var $password               = $('#password'),
    $validation_length      = $('#validation_length'),
    $validation_case        = $('#validation_case'),
    $validation_uppercase   = $('#validation_uppercase'),
    $validation_lowercase   = $('#validation_lowercase'),
    $validation_number      = $('#validation_number'),
    $password_requirements  = $('#password_requirements'),
    $incomplete_span,
    $complete_span;

// HTML injection
var $incomplete_symbol =
      "<span id='incomplete_symbol' class='incomplete-symbol' style='color:hsl(0, 0%, 0%)'>" +
      "&#10044   </span>",
    $complete_symbol =
      "<span id='complete_symbol' class='complete-symbol' style='color:hsl(180, 96%, 70%)'>" +
      "&#10048   </span>";

/* Defaults
=====================================*/

$validation_length.prepend($incomplete_symbol);
$validation_case.prepend($incomplete_symbol);
$validation_number.prepend($incomplete_symbol);
$incomplete_span = $('.incomplete-symbol');

$validation_length.prepend($complete_symbol);
$validation_case.prepend($complete_symbol);
$validation_number.prepend($complete_symbol);
$complete_span = $('.complete-symbol');
$complete_span.hide();

/* Interactions
=====================================*/

$password.on('focus', function(evt) {
  if(first_focus) {
    $incomplete_span.attr('style', 'color:hsl(359, 96%, 70%)');
    first_focus = false;
  }
  $complete_span.hide();
  $incomplete_span.show();
  $password.css('background', 'hsl(180, 96%, 90%)');
});

$password.on('blur', function(evt) {
  $incomplete_span.hide();
  $complete_span.show();
  $password.css('background', 'hsl(359, 96%, 90%)');
});

$password.on('input', function(evt) {

});




// call on page load
hidePages();
$login.show();