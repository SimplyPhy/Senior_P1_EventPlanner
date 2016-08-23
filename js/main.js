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
    $add_event_button = $('#add_event_button');


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

$add_event_button.click(function() {
  // $view_events needs to be disabled here
  $create_event.show();
  // need to find a way to get .create-event div above .show-events div
});


// call on page load
hidePages();
$login.show();