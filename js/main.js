'use strict';
/*global $:false*/

// ==========================================================================
// Pages
// ==========================================================================

var $login        = $('.login'),
    $profile      = $('.profile'),
    $view_events  = $('.view-events'),
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

var $goto_profile_button      = $('#goto_profile_button'),
    $login_button             = $('#login_button'),
    $save_profile_button      = $('#save_profile_button'),
    $continue_profile_button  = $('#continue_profile_button'),
    $add_event_button         = $('#add_event_button'),
    $create_event_button      = $('#create_event_button');

var firstInput;

$goto_profile_button.click(function() {
  $login.hide();
  $profile.show();
  // setAutofocus();  --> Note to reviewer: I didn't set autofocus here because
});                    // I found it to detriment the UX

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
  $guests_container.hide();
  first_guest = true;
  setAutofocus();
  evt.preventDefault();
});

function setAutofocus() {
  if ($create_event.is(':visible')) {
    firstInput = $create_event.find(':input').filter(':visible:first');
  } else {
    firstInput = $('form').find(':input').filter(':visible:first');
  }

  firstInput.focus();
}

// ==========================================================================
// Create New Event Page
// ==========================================================================

// Event Object Constructor
function Event(name, type, host, startDate, startHour, startMin, endDate, endHour, endMin, guests, location, message) {
  // Not necessary, but will be added if I choose to incorporate a backend
  // Hour would use option values as found in HTML doc (military time)
  // Guests is an array
}

// Event Inputs and Buttons
var $event_name         = $('#event_name'),
    $event_type         = $('#event_type'),
    $event_host         = $('#host'),
    $event_start        = $('#start_time'),
    $event_start_hour   = $('#start_hour_select'),
    $event_hour_select  = $('.hour-select'),
    $event_start_minute = $('#start_minute_select'),
    $event_start_ampm   = $('#start_ampm_select'),
    $event_end          = $('#end_time'),
    $event_end_hour     = $('#end_hour_select'),
    $event_end_minute   = $('#end_minute_select'),
    $event_end_ampm     = $('#end_ampm_select'),
    $event_guests       = $('#guest_input'),
    $guests_button      = $('#guests_button'),
    $guests_container   = $('#guests_container'),
    $event_location     = $('#location'),       // This will come from Google API
    $event_message      = $('#guest_message');

// Add guest functionality
var new_guest,
    guest_div,
    first_guest = true,
    guest_array = [],
    guest_id = 0,
    prev_guest_id;

function createGuestDiv(guestName) {

  guest_div = "<div id='guest"+guest_id+"' class='new-guests'>" +
                "<span class='guest-span'>"+guestName+"</span>" +
                "<button type='button' class='guest-remove'> x</button>" +
              "</div>";

  guest_id++;
  return guest_div;
}

$event_guests.on('input keypress', function(e) {
  if ($event_guests.val().length > 0) {
    $guests_button.css('background', 'hsl(180, 96%, 90%)'); // inefficient because if statement runs every input.  Would be better using a bool to test input state (unless browser is smart)
    if (e.which == 13){
      $guests_button.trigger('click');
    }
  } else {
    $guests_button.css('background', 'hsl(359, 96%, 90%)');
  }
});

$guests_button.click(function() {
  if ($event_guests.val().length > 0) {
    if (first_guest) {
      $guests_container.show();
      first_guest = false;
    }
    new_guest = $event_guests.val();
    guest_array.push(new_guest);
    $guests_container.append(createGuestDiv(new_guest));
    $event_guests.val("");
    $event_guests.focus();
    $guests_button.css('background', 'linear-gradient(170deg, rgb(255, 255, 255) 30%, hsl(147, 47%, 96%) 60%)');
    prev_guest_id = guest_id - 1;
    removeGuestListener($('#guest'+prev_guest_id+' .guest-remove'));
  }
});

function removeGuestListener(guest) {
  guest.click(function(){
    console.log("happy");
    $(this).parent().remove();
  });
}

// Create Date and Time inputs
$('#birthday').datepicker({ changeYear: true, yearRange: "1900:2016" });
$event_start.datepicker();
$event_start_hour.selectmenu();
$event_start_minute.selectmenu();
$event_start_ampm.selectmenu();
$event_end.datepicker();
$event_end_hour.selectmenu();
$event_end_minute.selectmenu();
$event_end_ampm.selectmenu();

$event_hour_select
  .selectmenu('menuWidget')
  .addClass('overflow');

// New Event Variables
var $events_container = $('#events_container'),
    eventId = 0,
    eventData = [],
    guests = [],      // This value will need to be established by before eventContainerContent is run
    eventDiv,
    currentEventDiv;

function eventContainerContent() {
  eventData.push([$event_name.val(),
                  $event_type.val(),
                  $event_host.val(),
                  $event_start.val(),
                  $event_end.val(),
                  $event_message.val(),
                  $event_guests.val(),
                  $event_location.val()
  ]);

  eventDiv =  "<div class='event' id='eventNum"+eventId+"'>" +
                "<div class='event-name'>"+$event_name.val()+"</div>" +
                "<div class='event-type' style='display: none;'>"+$event_type.val()+"</div>" +
                "<div class='event-host'>Host: "+$event_host.val()+"</div>" +
                "<div class='event-time'>" +
                  "<div class='event-start' style='display: none;'>"+$event_start.val()+"</div>" +
                  "<div class='event-end' style='display: none;'>"+$event_end.val()+"</div>" +
                "</div>" +
                "<div class='event-message' style='display: none;'>"+$event_message.val()+"</div>" +
                "<div class='event-guests-container'>" +
                  "<div class='event-guests-names' style='display: none;'>"+$event_guests.val()+"</div>" +
                  "<div class='event-guests-count'>"+guest_array.length+" Guests</div>" +
                "</div>" +
                "<div class='event-location' style='display: none;'>"+$event_location.val()+"</div>" +
              "</div>";
  eventId++;
  return eventDiv;
}

$create_event_button.click(function() {
  currentEventDiv = eventContainerContent();
  $events_container.append(currentEventDiv);

  postEventPrep();
  $create_event.hide();
});

function postEventPrep() {
  document.getElementById('create_event_form').reset();
  $guests_container.children().remove();
  eventDiv = "";
  eventData = [];
  guest_array = [];
};


// ==========================================================================
// Form Validation
// ==========================================================================

/* Variable Assignments
=====================================*/

// Input Fields
var $name     = $('#name'),
    $email    = $('#email'),
    $password = $('#password');

// Bools
var first_focus_name  = true,
    first_focus_email = true,
    first_focus_pass  = true;

// RegEx
var reqNum    = new RegExp('[0-9]'),
    reqLow    = new RegExp('[a-z]'),
    reqUpp    = new RegExp('[A-Z]'),
    reqEmail  = new RegExp('^\\S+@\\S+[\\.][0-9a-z]+$');

// Password Requirements
var $validation_length      = $('#validation_length'),
    $validation_case        = $('#validation_case'),
    $validation_uppercase   = $('#validation_uppercase'),
    $validation_lowercase   = $('#validation_lowercase'),
    $validation_number      = $('#validation_number'),
    $password_requirements  = $('#password_requirements'),
    $incomplete_span,
    $complete_span;

// Requirements State
var state_name      = false,
    state_email     = false,
    state_length    = false,
    state_case      = false,
    state_upperCase = false,
    state_lowerCase = false,
    state_number    = false,
    state_password  = false;

// HTML injection
function $incomplete_symbol(portion) {
  return "<span id='incomplete_symbol_" + portion + "' class='incomplete-symbol' style='color:hsl(0, 0%, 0%)'>" +
  "&#10044   </span>";
};

function $complete_symbol(portion) {
  return "<span id='complete_symbol_" + portion + "' class='complete-symbol' style='color:hsl(180, 96%, 70%)'>" +
  "&#10048   </span>";
};

/* Defaults
=====================================*/

// Establish incomplete symbols and class selection
function incompleteValidationPassword (portion) {
  if (!portion) {
    $validation_length.prepend($incomplete_symbol('length'));
    $validation_case.prepend($incomplete_symbol('case'));
    $validation_number.prepend($incomplete_symbol('number'));
    $incomplete_span = $('.incomplete-symbol');
  } else {

    // Set individual params for incomplete symbol showing
    if (portion === 'length') {
      $('#complete_symbol_length').hide();
      $('#incomplete_symbol_length').show();
      state_length = false;
    } else if (portion === 'case') {
      $('#complete_symbol_case').hide();
      $('#incomplete_symbol_case').show();
      state_case = false;
    } else if (portion === 'number') {
      $('#complete_symbol_number').hide();
      $('#incomplete_symbol_number').show();
      state_number = false;
    }
  }
};

// Establish complete symbols and class selection
function completeValidationPassword (portion) {
  if (!portion) {
    $validation_length.prepend($complete_symbol('length'));
    $validation_case.prepend($complete_symbol('case'));
    $validation_number.prepend($complete_symbol('number'));
    $complete_span = $('.complete-symbol');
    $complete_span.hide();
  } else{

    // Set individual params for complete symbol showing
    if (portion === 'length') {
      $('#incomplete_symbol_length').hide();
      $('#complete_symbol_length').show();
      state_length = true;
    } else if (portion === 'case') {
      $('#incomplete_symbol_case').hide();
      $('#complete_symbol_case').show();
      state_case = true;
    } else if (portion === 'number') {
      $('#incomplete_symbol_number').hide();
      $('#complete_symbol_number').show();
      state_number = true;
    }
  }
};

// Instantiate validation settings
incompleteValidationPassword();
completeValidationPassword();

/* Interactions
=====================================*/

$name.on('focus', function() {
  // Length value is checked first incase auto-fill has been used
  if ($name.val().length === 0) {
    if (first_focus_name) {
      $name.css('background', 'hsl(359, 96%, 90%)');
      first_focus_name = false;
    }
  } else if (first_focus_name === true) {
    first_focus_name = false;
  }
});

$name.on('input change', function() {
  if (!state_name) {
    if ($name.val().length > 0) {
      $name.css('background', 'hsl(180, 96%, 90%)');
      state_name = true;
    }
  } else {
    if (!$name.val()) {
      $name.css('background', 'hsl(359, 96%, 90%)');
      state_name = false;
    }
  }
});

$email.on('focus', function() {
  // Length value is checked first incase auto-fill has been used
  if ($email.val().length === 0) {
    if (first_focus_email) {
      $email.css('background', 'hsl(359, 96%, 90%)');
      first_focus_email = false;
    }
  } else if (first_focus_email === true) {
    first_focus_email = false;
  }
});

$email.on('input', function() {
  if (!state_email) {
    if (reqEmail.test($email.val())) {
      $email.css('background', 'hsl(180, 96%, 90%)');
      state_email = true;
    }
  } else {
    if (!reqEmail.test($email.val())) {
      $email.css('background', 'hsl(359, 96%, 90%)');
      state_email = false;
    }
  }
});

$password.on('focus', function(evt) {
  if (first_focus_pass) {
    $incomplete_span.attr('style', 'color:hsl(359, 96%, 70%)');
    $password.css('background', 'hsl(359, 96%, 90%)');
    $validation_lowercase.css('color', 'hsl(359, 96%, 70%)');
    $validation_uppercase.css('color', 'hsl(359, 96%, 70%)');
    first_focus_pass = false;

  }
  // if i notify when something is wrong on blur, then deactivate that here
});

$password.on('blur', function(evt) {
  // maybe notify if something is wrong
});

$password.on('input', function(evt) {
  if (!state_length) {
    if ($password.val().length >= 6 && $password.val().length <= 30) {
      state_length = true;
      completeValidationPassword('length');
    }
  } else {
    if ($password.val().length < 6 || $password.val().length > 30) {
      state_length = false;
      incompleteValidationPassword('length');
    }
  }

  if (!state_case) {

    if (!state_lowerCase) {
      if (reqLow.test($password.val())) {
        state_lowerCase = true;
        $validation_lowercase.css('color', 'hsl(146, 23%, 35%)');
      }
    } else {
      if (!reqLow.test($password.val())) {
        state_lowerCase = false;
        $validation_lowercase.css('color', 'hsl(359, 96%, 70%)');
      }
    }

    if (!state_upperCase) {
      if (reqUpp.test($password.val())) {
        state_upperCase = true;
        $validation_uppercase.css('color', 'hsl(146, 23%, 35%)');
      }
    } else {
      if (!reqUpp.test($password.val())) {
        state_upperCase = false;
        $validation_uppercase.css('color', 'hsl(359, 96%, 70%)');
      }
    }

    if (state_upperCase && state_lowerCase) {
      state_case = true;
      completeValidationPassword('case');
    }

  } else {

    if (!reqLow.test($password.val())) {
        state_lowerCase = false;
        $validation_lowercase.css('color', 'hsl(359, 96%, 70%)');
    }
    if (!reqUpp.test($password.val())) {
        state_upperCase = false;
        $validation_uppercase.css('color', 'hsl(359, 96%, 70%)');
    }
    if (!state_upperCase || !state_lowerCase) {
      state_case = false;
      incompleteValidationPassword('case');
    }
  }

  if (!state_number) {
    if (reqNum.test($password.val())) {
      state_number = true;
      completeValidationPassword('number');
    }
  } else {
    if (!reqNum.test($password.val())) {
      state_number = false;
      incompleteValidationPassword('number');
    }
  }

  if (!state_password) {
    if (state_length && state_case && state_number) {
      state_password = true;
      $password.css('background', 'hsl(180, 96%, 90%)');
    }
  } else {
    if (!state_length || !state_case || !state_number) {
      state_password = false;
      $password.css('background', 'hsl(359, 96%, 90%)');
    }
  }

});


// call on page load
hidePages();
// $view_events.show();
$login.show();
// $create_event.show();
setAutofocus();



