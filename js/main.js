'use strict';
/*global $:false*/

// ==========================================================================
// Pages
// ==========================================================================

// page layouts
var $login        = $('.login'),
    $profile      = $('.profile'),
    $view_events  = $('.view-events-layout'),
    $create_event = $('.create-event');

// page array
var $pages = [
    $login,
    $profile,
    $view_events,
    $create_event
];

// pages are only ever hidden from the user
function hidePages () {
  $.each($pages, function(i, value) {
    $(this).hide();
  });
}

// which page to show (only one at a time)
function showPages () {
  $.each($pages, function(i, value) {
    $(this).show();
  });
}

// ==========================================================================
// Buttons and Navigation
// ==========================================================================

// buttons
var $goto_profile_button      = $('#goto_profile_button'),
    $login_button             = $('#login_button'),
    $save_profile_button      = $('#save_profile_button'),
    $continue_profile_button  = $('#continue_profile_button'),
    $add_event_button         = $('#add_event_button'),
    $create_event_button      = $('#create_event_button');

// profile page inputs
var $employer     = $('#employer'),
    $position     = $('#position'),
    $phone_number = $('#phone_number'),
    $birthday     = $('#birthday');

// set to first input on each page
var firstInput;

// profile page save button functionality
// when save is clicked, change background to lightblue for filled in inputs, and white for blank inputs
$save_profile_button.click(function() {
  if ($employer.val().length > 0) {
    $employer.css('background', 'hsl(180, 96%, 90%)');
  } else {
    $employer.css('background', 'hsl(0, 0%, 100%)');
  }
  if ($position.val().length > 0) {
    $position.css('background', 'hsl(180, 96%, 90%)');
  } else {
    $position.css('background', 'hsl(0, 0%, 100%)');
  }
  if ($phone_number.val().length > 0) {
    $phone_number.css('background', 'hsl(180, 96%, 90%)');
  } else {
    $phone_number.css('background', 'hsl(0, 0%, 100%)');
  }
  if ($birthday.val().length > 0) {
    $birthday.css('background', 'hsl(180, 96%, 90%)');
  } else {
    $birthday.css('background', 'hsl(0, 0%, 100%)');
  }
});

// continue button functionality in profile page (go to view-event page)
$continue_profile_button.click(function() {
  $profile.hide();
  $view_events.show();
});

// add-event button functionality (show create-event page)
$add_event_button.click(function(evt) {
  $create_event.show();
  $guests_container.hide();
  first_guest = true;
  setAutofocus();
  evt.preventDefault();
  // hide background button and header
  $add_event_button.css('visibility', 'hidden');
  $('#my_events_header').css('visibility', 'hidden');
});

// set focus to first input for the currently visible page
// when create-event page is visible, show-events page is also techniquely visible and active, so focus on create-event input
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
  // not necessary, but will be added if I choose to provide saved data options in the future
  // guest_array is used for now
}

// event inputs and buttons
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
    $event_location     = $('#location'),
    $event_message      = $('#guest_message');

// add guest functionality
var new_guest,
    guest_div,
    first_guest = true,
    guest_array = [],
    guest_id = 0;

// html block containing each new guest in the guestlist container
function createGuestDiv(guestName) {
  guest_div = "<div id='guest"+guest_id+"' class='new-guests'>" +
                "<span class='guest-span'>"+guestName+"</span>" +
                "<button type='button' class='guest-remove'> x</button>" +
              "</div>";
  return guest_div;
}

// guests button functionality; also triggered when enter is clicked inside guest input
$guests_button.click(function() {
  if ($event_guests.val().length > 0) {
    if (first_guest) {
      $guests_container.show();
      first_guest = false;
    }
    new_guest = $event_guests.val();
    guest_array.push({id: guest_id, name: new_guest});
    $guests_container.append(createGuestDiv(new_guest));
    removeGuestListener($('#guest'+guest_id+' .guest-remove'));
    guest_id++;
    $event_guests.val('');
    $event_guests.focus();
    $guests_button.css('background', 'linear-gradient(170deg, rgb(255, 255, 255) 30%, hsl(147, 47%, 96%) 60%)');
  }
});

// when x button clicked in a guest div, delete that guest from guest list and remove guest from guestlist container
function removeGuestListener(guest) {
  guest.click(function(){
    var thisElem = $(this).parent();
    var thisIndex = $('.new-guests').index(thisElem);
    $(this).parent().remove();

    for (var i = 0; i < guest_array.length; i++) {
      if (i === thisIndex) {
        guest_array.splice(i, 1);
      }
    }
  });
}

// create date and time inputs for birthday input.  If you're older than 116, I'm impressed :P
$('#birthday').datepicker({ changeYear: true, yearRange: "1900:2016" });

// style date and time selections for start date
$event_start.datepicker({
  dateFormat: 'M d, yy'
});
$event_start_hour.selectmenu();
$event_start_minute.selectmenu();
$event_start_ampm.selectmenu();

// style date and time selections for end date
$event_end.datepicker({
  dateFormat: 'M d, yy'
});
$event_end_hour.selectmenu();
$event_end_minute.selectmenu();
$event_end_ampm.selectmenu();

// style hour selection
$event_hour_select
  .selectmenu('menuWidget')
  .addClass('overflow');

// new event variables
var $events_container = $('#events_container'),
    eventId = 0,
    eventData = [],
    guests = [],
    multiday = false,
    multiDash = "",
    duration = false,
    durationDash = "",
    eventDiv,
    currentEventDiv;

// most of functionality and div creation for creating new events
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

  // set and format datepicker values
  var event_start_display = $.datepicker.parseDate('M d, yy', $event_start.val()),
      event_start_year    = $.datepicker.formatDate('yy', event_start_display),
      event_start_month   = $.datepicker.formatDate('M', event_start_display),
      event_start_day     = $.datepicker.formatDate('d', event_start_display),
      event_start_time    = '12:00am',
      event_end_display   = $.datepicker.parseDate('M d, yy', $event_end.val()),
      event_end_year      = $.datepicker.formatDate('yy', event_end_display),
      event_end_month     = $.datepicker.formatDate('M', event_end_display),
      event_end_day       = $.datepicker.formatDate('d', event_end_display),
      event_end_time      = '12:00am';

  // bool vars for equal start/end dates
  var sameYear  = false,
      sameMonth = false,
      sameDay   = false,
      sameTime  = false,
      sameDate  = true;

  // guest vars for current event
  var guestList           = "",
      guestMessageHeader  = "",
      guestMessageDiv     = "",
      guest_message       = "Message to "+guest_array.length+" guests: ";

  // date/time validation with logs for debugging
  if (event_start_year == event_end_year) {
    console.log("sameYear");
    sameYear = true;
  }
  if (event_start_month == event_end_month) {
    console.log("sameMonth");
    sameMonth = true;
  }
  if (event_start_day == event_end_day) {
    console.log("sameDay");
    sameDay = true;
  }
  if (startMin == 0) {
    startMin = '00';
  }
  if (endMin == 0) {
    endMin = '00';
  }
  if (startHour === endHour && startMin === endMin && startAMPM === endAMPM) {
    sameTime = true;
  }
  if (sameYear && sameMonth && sameDay) {
    console.log("same-YMD");
    event_start_display = $.datepicker.formatDate('M d, yy', event_start_display);
    console.log(event_start_display);
    event_end_display   = '';
  } else if (sameYear && sameMonth && !sameDay) {
    console.log("same-YM");
    event_start_display = $.datepicker.formatDate('M d', event_start_display);
    event_end_display   = $.datepicker.formatDate('d, yy', event_end_display);
  } else if (sameYear && !sameMonth) {
    console.log("same-Y");
    event_start_display = $.datepicker.formatDate('M d', event_start_display);
    event_end_display   = $.datepicker.formatDate('M d, yy', event_end_display);
  } else if (!sameYear) {
    console.log("same-None");
    event_start_display = $.datepicker.formatDate('M d, yy', event_start_display);
    event_end_display   = $.datepicker.formatDate('M d, yy', event_end_display);
  }
  if (event_start_year != event_end_year || event_start_month != event_end_month || event_start_day != event_end_day) {
    sameDate = false;
  }
  if (sameTime && sameDate) {
    console.log("same-time");
    event_start_time = startHour + ":" + startMin + startAMPM;
    event_end_time   = '';
  } else {
    console.log("not-same-time");
    event_start_time = startHour + ":" + startMin + startAMPM;
    event_end_time   = endHour + ":" + endMin + endAMPM;
  }
  if (!sameTime || !sameYear || !sameMonth || !sameDay) {
    duration = true;
    durationDash = " - ";
  }

  console.log("event_start: "       +event_start_display     +"\n" +
              "event_start_time: "  +event_start_time        +"\n" +
              "event_end: "         +event_end_display       +"\n" +
              "event_end_time: "    +event_end_time          +"\n"
  );

  if ($event_start.val() != $event_end.val()) {
    multiday = true;
    multiDash = " - ";
  }

  // create guestList
  for (var i = 0; i < guest_array.length; i++) {
    if (i < guest_array.length - 1) {
      guestList += guest_array[i].name + ", ";
    } else {
      guestList += guest_array[i].name;
    }
  }

  // create event message divs only if user creates a guest message
  if ($event_message.val().length > 0) {
    guestMessageHeader  = "<div class='event-message-header event-invisible' style='display: none;'>" +guest_message       +"</div>";
    guestMessageDiv     = "<div class='event-message event-visible'>"                                 +$event_message.val()+"</div>";
  }

  // the big kahuna.  The full event div, built from user input and eventId used to increment event...ids :P
  eventDiv =  "<div class='event' id='eventNum"                                                   +eventId                                                            +"'>" +
                "<img src='img/event-close-icon.png' alt='Click to close your event' class='event-close-icon' id='event_close_icon"+eventId+"'>"                      +
                "<img src='img/event-expand-icon.png' alt='Click to expand your event' class='event-expand-icon' id='event_expand_icon"+eventId+"'>"                  +
                "<div class='event-name event-visible'>"                                          +$event_name.val()                                                  +"</div>" +
                "<div class='event-type event-invisible' style='display: none;'>"                 +$event_type.val()                                                  +"</div>" +
                "<div class='event-host event-visible'>Host: "                                    +$event_host.val()                                                  +"</div>" +
                "<div class='event-time-header event-invisible' style='display: none;'>"          +"When:"                                                            +"</div>" +
                "<div class='event-start event-visible'>"                                         +event_start_display+multiDash+event_end_display                    +"</div>" +
                "<div class='event-start-time event-invisible' style='display: none;'>"           +event_start_time+durationDash+event_end_time                       +"</div>" +
                "<div class='event-location-header event-invisible' style='display: none;'>"      +"Where:"                                                           +"</div>" +
                "<div class='event-location event-invisible' style='display: none;'>"             +$event_location.val()                                              +"</div>" +
                guestMessageHeader                                                                +
                "<div class='event-guests-div event-invisible' style='display: none;'>"           +
                  guestMessageDiv                                                                 +
                  "<div class='event-guestlist-header' id='guestlistHeader"+eventId+"'>"          +"Guest List "                                                      +
                    "<img src='img/event-expand-icon.png' alt='Click to expand your guestlist' class='guestlist-expand-icon' id='guestlist_expand_icon"+eventId+"'>"  +"</div>" +
                  "<div class='event-guestlist' id='guestlist"+eventId+"' style='display: none;'>"+guestList                                                          +"</div>" +
                "</div>"                                                                          +
              "</div>";

  multiDash = "";
  return eventDiv;
}

// create_event click functionality
$create_event_button.click(function() {
  clearAlerts();
  eventValidation();
});

// this is where final validation will occurs for events, and alerts are set for incomplete/invalid inputs
// check guest_array length for guest validation
// also check that dates are sequential
function eventValidation() {
  if (event_name_status === false) {
    $event_name.alertMsg("Please name your event.");
  }
  if (event_type_status === false) {
    $event_type.alertMsg("Please categorize your event.<br> Ex. birthday, wedding, etc.");
  }
  if (event_host_status === false) {
    $event_host.alertMsg("Please type the host's name above.<br> No host?  Just type \"none\".");
  }
  if (event_start_status === false) {
    $event_start.alertMsg("Please type or select the date that your event begins.");
  }
  if (event_end_status === false) {
    $event_end.alertMsg("Please type or select the date that your event ends.");
  }
  if (event_message_status === false) {
    // this is an optional field
  }
  if (guest_array.length === 0) {
    $('#guests_inputs_div').alertMsg("Please add a guest to your event.<br>No guests?  Just add \"none\".");
  }
  if (event_location_status === false) {
    $event_location.alertMsg("Please type in your event's location.");
  }
  if (compareTime($event_start.val(), $event_end.val()) === false) {
    event_time_status = false; // alert messages are activated in compareTime()
  } else if (compareTime($event_start.val(), $event_end.val()) === true) {
    event_time_status = true;
  }

  // if everything looks good, create the event, add it to view-events page, set listeners, clear form data, and hide create_event page
  if (event_name_status && event_type_status && event_host_status && event_start_status && event_end_status && event_time_status && guest_array.length > 0 && event_location_status) {
    currentEventDiv = eventContainerContent();
    $events_container.append(currentEventDiv);
    newEventClickListener(eventId);
    guestlistListener();
    eventCloseListener();

    postEventPrep();
    $create_event.hide();
  }
}

// fake event x-icon listener
$('.event-close-icon').click(function(e) {
  e.stopPropagation();
  $('#eventFake1').animate({height: 'toggle'}, function() {
    $('#eventFake1').remove();
  });
});

// Remove event when x-icon is clicked
function eventCloseListener() {
  var thisClose     = "#event_close_icon"+eventId,
      thisEventNum  = "#eventNum"+eventId;

  $(thisClose).click(function(e) {
    e.stopPropagation();
    $(thisEventNum).animate({height: 'toggle'}, function() {
      $(thisEventNum).remove();
    });
  });
}

// guestlist open/close functionality and animations
function guestlistListener() {
  var guestlistHeaderId = "#guestlistHeader"+eventId,
      guestlistId       = "#guestlist"+eventId,
      guestHeadList     = guestlistHeaderId+", "+guestlistId,
      guestlistIconId   = "#guestlist_expand_icon"+eventId,
      localBool         = true;

  $(guestHeadList).click(function(e) {
    e.stopPropagation();
    $(guestlistId).slideToggle();
    if (localBool) {
      $(guestlistIconId).css('animation', 'event-button-rotate 0.4s linear');
      $(guestlistIconId).css('transform', 'rotate(90deg)');
    } else {
      $(guestlistIconId).css('animation', 'event-button-rotate-back 0.4s linear');
      $(guestlistIconId).css('transform', 'rotate(0deg)');
    }
    localBool = !localBool;
  });
}

// event open/close functionality and animations
function newEventClickListener(currentID) {
  var localBool = true;
  $('#eventNum'+currentID).click(function() {
    $(this).children('.event-invisible').slideToggle();
    if (localBool) {
      $('#event_expand_icon'+currentID).css('animation', 'event-button-rotate 0.4s linear');
      $('#event_expand_icon'+currentID).css('transform', 'rotate(90deg)');
    } else {
      $('#event_expand_icon'+currentID).css('animation', 'event-button-rotate-back 0.4s linear');
      $('#event_expand_icon'+currentID).css('transform', 'rotate(0deg)');
    }
    localBool = !localBool;
  });
}

// fake event guestlist_icon listener
var fakeBool2 = true; // probably didn't 'have' to be global, but easier this way for fake event
$('#guestlistHeader, #guestlist').click(function(e) {
  e.stopPropagation();
  $('#guestlist').slideToggle();
  if (fakeBool2) {
    $('#guestlist_expand_icon').css('animation', 'event-button-rotate 0.4s linear');
    $('#guestlist_expand_icon').css('transform', 'rotate(90deg)');
    fakeBool2 = !fakeBool2;
  } else {
    $('#guestlist_expand_icon').css('animation', 'event-button-rotate-back 0.4s linear');
    $('#guestlist_expand_icon').css('transform', 'rotate(0deg)');
    fakeBool2 = !fakeBool2;
  }
});

// click listener for fake (example/placeholder) events
var fakeBool = true;
$('.fake-event').click(function() {
  $(this).children('.event-invisible').slideToggle();
  if (fakeBool) {
    $('.event-expand-icon').css('animation', 'event-button-rotate 0.4s linear');
    $('.event-expand-icon').css('transform', 'rotate(90deg)');
    fakeBool = !fakeBool;
  } else {
    $('.event-expand-icon').css('animation', 'event-button-rotate-back 0.4s linear');
    $('.event-expand-icon').css('transform', 'rotate(0deg)');
    fakeBool = !fakeBool;
  }
});

// after event is created or closed, clean house
function postEventPrep() {
  if (multiday) {
    var id = 'eventNum' + eventId;
    $('#'+id+' .event-end').css('display', 'block');
    multiday = false;
  }
  eventId++;
  document.getElementById('create_event_form').reset();
  $guests_container.children().remove();
  eventDiv = "";
  eventData = [];
  guest_array = [];
  firstHourInput = true;
  durationDash = "";

  // show header and add-event-button again
  $add_event_button.css('visibility', 'visible');
  $('#my_events_header').css('visibility', 'visible');

  // Not very DRY, but it does the job.  A less DRY way would be if I used OOP for events,
  // and looped through all instances.  An array doesn't seem any DRYer to me.  :sad-face:
  event_name_status     =   false;
  event_type_status     =   false;
  event_host_status     =   false;
  event_start_status    =   false;
  event_end_status      =   false;
  event_time_status     =   false;
  event_message_status  =   false;
  event_guests_status   =   false;
  event_location_status =   false;
  duration              =   false;
  $event_name.css     ('background', 'hsl(0, 0%, 100%)');
  $event_type.css     ('background', 'hsl(0, 0%, 100%)');
  $event_host.css     ('background', 'hsl(0, 0%, 100%)');
  $event_start.css    ('background', 'hsl(0, 0%, 100%)');
  $event_end.css      ('background', 'hsl(0, 0%, 100%)');
  $event_message.css  ('background', 'hsl(0, 0%, 100%)');
  $event_guests.css   ('background', 'hsl(0, 0%, 100%)');
  $event_location.css ('background', 'hsl(0, 0%, 100%)');
  $guests_button.css  ('background', 'hsl(0, 0%, 100%)');
};

// clear all alerts, whether good or bad
function clearAlerts() {
   $('.alert-msg, .success-msg').remove();
}

// ==========================================================================
// Event Validation
// ==========================================================================

// set event status per input
var event_name_status     = false,
    event_type_status     = false,
    event_host_status     = false,
    event_start_status    = false,
    event_end_status      = false,
    event_time_status     = false,
    event_message_status  = false,
    event_guests_status   = false,    // This value is used to check current input status, not guestlist status.
    event_location_status = false;    // Use guest_array.length to affirm guestlist status.

// error/alert message per input
var event_name_error        = "Please name your event",
    event_type_error        = "Please specify the type of your event"+"<br>"+"for example: \"birthday\"",
    event_host_error        = "Please name the host of your event",
    event_time_type_error   = "Please select a date from the calendar or"+"<br>"+"use mm/dd/yyyy format",
    event_time_switch_error = "Oops!  Your event can't end before it begins!",
    event_guests_error      = "Please add at least one guest to your event"+"<br>"+"even if it's just you",
    event_location_error    = "Please add a location for your event";

// event name validation listeners
$event_name.on('input change', function() {
  if (!event_name_status) {
    if ($event_name.val().length > 0) {
      event_name_status = true;
      $event_name.css('background', 'hsl(180, 96%, 90%)');
    } else {
      $event_name.css('background', 'hsl(359, 96%, 90%)');
    }
  } else {
    if ($event_name.val().length == 0) {
      event_name_status = false;
      $event_name.css('background', 'hsl(359, 96%, 90%)');
    }
  }
});
$event_name.on('blur', function() {
  if(event_name_status === true) {
    alertSuccess($(this));
  }
});

// event type validation listeners
$event_type.on('input change', function() {
  if (!event_type_status) {
    if ($event_type.val().length > 0) {
      event_type_status = true;
      $event_type.css('background', 'hsl(180, 96%, 90%)');
    } else {
      $event_type.css('background', 'hsl(359, 96%, 90%)');
    }
  } else {
    if ($event_type.val().length == 0) {
      event_type_status = false;
      $event_type.css('background', 'hsl(359, 96%, 90%)');
    }
  }
});
$event_type.on('blur', function() {
  if(event_type_status === true) {
    alertSuccess($(this));
  }
});

// event host validation listeners
$event_host.on('input change', function() {
  if (!event_host_status) {
    if ($event_host.val().length > 0) {
      event_host_status = true;
      $event_host.css('background', 'hsl(180, 96%, 90%)');
    } else {
      $event_host.css('background', 'hsl(359, 96%, 90%)');
    }
  } else {
    if ($event_host.val().length == 0) {
      event_host_status = false;
      $event_host.css('background', 'hsl(359, 96%, 90%)');
    }
  }
});
$event_host.on('blur', function() {
  if(event_host_status === true) {
    alertSuccess($(this));
  }
});

// Date start validation.  Regex fix resolves Date.prototype's inability to parse 'nth' date
// inputs.  E.g. 'September 15th, 2017' returns an error, while 'September 15, 2017' is fine.
$event_start.on('change', function() {
  if ($event_start.val().length == 0) {
      $event_start.css('background', 'hsl(359, 96%, 90%)');
      $event_start.val("");
      event_start_status = false;
      return;
  }

  var validDate = "",
      nthFix = /\d+(?=(st|nd|rd|th))/,
      nthTest = nthFix.exec($event_start.val()),
      numVal = "",
      nthVal = "",
      correctedDate = "";

  if (nthTest) {
    numVal = nthTest[0]; // returns numeric value in 'nth' sequence
    nthVal = nthTest[1]; // returns '(st|nd|rd|th)' value in 'nth' sequence
    var correctedDate = $event_start.val().replace(nthTest[1], ""); // removes (st|nd|rd|th) from 'nth' sequence
    $event_start.val(correctedDate);
  }

  if ($event_start.val()) {
    // normalizes any accepted date format to 'M d, yy'
    $event_start.val($.datepicker.formatDate('M d, yy', new Date($event_start.val())))
    try {
      validDate = $.datepicker.parseDate('M d, yy', $event_start.val());
      if (!event_start_status) {
        event_start_status = true;
        $event_start.css('background', 'hsl(180, 96%, 90%)');
      }
    } catch (err1) {
      console.log("error: invalid start date input");
      $event_start.css('background', 'hsl(359, 96%, 90%)');
      $event_start.val("");
      event_start_status = false;
    };
  }
});

// Date end validation.  Regex fix resolves Date.prototype's inability to parse 'nth' date
// inputs.  E.g. 'September 15th, 2017' returns an error, while 'September 15, 2017' is fine.
$event_end.on('change', function() {
  if ($event_end.val().length == 0) {
    $event_end.css('background', 'hsl(359, 96%, 90%)');
    $event_end.val("");
    event_end_status = false;
    return;
  }

  var validDate = "",
    nthFix = /\d+(?=(st|nd|rd|th))/,
    nthTest = nthFix.exec($event_end.val()),
    numVal = "",
    nthVal = "",
    correctedDate = "";

  if (nthTest) {
    numVal = nthTest[0]; // returns numeric value in 'nth' sequence
    nthVal = nthTest[1]; // returns '(st|nd|rd|th)' value in 'nth' sequence
    var correctedDate = $event_end.val().replace(nthTest[1], ""); // removes (st|nd|rd|th) from 'nth' sequence
    $event_end.val(correctedDate);
  }

  if ($event_end.val()) {
    // normalizes any accepted date format to 'M d, yy'
    $event_end.val($.datepicker.formatDate('M d, yy', new Date($event_end.val())))
    try {
      validDate = $.datepicker.parseDate('M d, yy', $event_end.val());
      if (!event_end_status) {
        event_end_status = true;
        $event_end.css('background', 'hsl(180, 96%, 90%)');
      }
    } catch (err1) {
      console.log("error: invalid end date input");
      $event_end.css('background', 'hsl(359, 96%, 90%)');
      $event_end.val("");
      event_end_status = false;
    };
  }
});

// full blur validation for dates/times
$('#start_time, #end_time, #start_hour_select-button, #start_minute_select-button, #start_ampm_select-button, #end_hour_select-button, #end_minute_select-button, #end_ampm_select-button').on('blur', function() {
  if(compareTime($event_start.val(), $event_end.val())) {
    alertSuccess($event_start);
    alertSuccess($event_end);
  }
});

// global compareTimes vars (so they aren't repeatedly reset)
var startHour = 0,
    startMin  = 0,
    startAMPM = 'am',
    endHour   = 0,
    endMin    = 0,
    endAMPM   = 'am';

// Check that start time input is earlier or the same as the end time input
function compareTime(time1, time2) {
  $('#start_time .success-msg').remove();
  var date1     = new Date(time1),
      date2     = new Date(time2),
      bool      = date1 > date2,
      equal     = date1 <= date2, // <= is used because otherwise the objects are compared ( '===' and '==' are always false),
      allGood   = date1 < date2;  // whereas the values are converts to numbers, then compared, when using <=

  // checks time values, and turns string numbers into ints for validation checks
  startHour = $('#start_hour_select-button .ui-selectmenu-text').text().replace(':', '');
  startHour = parseInt(startHour);
  startMin  = $('#start_minute_select-button .ui-selectmenu-text').text();
  startMin  = parseInt(startMin);
  startAMPM = $('#start_ampm_select-button .ui-selectmenu-text').text();
  endHour   = $('#end_hour_select-button .ui-selectmenu-text').text().replace(':', '');
  endHour   = parseInt(endHour);
  endMin    = $('#end_minute_select-button .ui-selectmenu-text').text();
  endMin    = parseInt(endMin);
  endAMPM   = $('#end_ampm_select-button .ui-selectmenu-text').text();

  // time/date validation BEGINS!
  if (allGood === true) {
    return true;
  }
  console.log("!allGood");
  if (bool === true) {
    console.log("dates issue"+ "\n");
    $event_start.siblings('.success-msg').remove();
    $event_start.alertMsg("Your event can't end before it begins<br>(check your dates) :P");
    return false;
  }
  if (equal === true) {
    console.log("equal === true"+ "\n");
    if (startAMPM === "pm" && endAMPM === "am") {
      console.log("ampm issue"+ "\n");
      $event_start.siblings('.success-msg').remove();
      $event_start.alertMsg("Your event can't end before it begins<br>(check your am/pm) :P");
      return false;
    }
    if ((startHour-endHour) > 0 && startHour !== 12) {
      console.log("hour issue"+ "\n");
      $event_start.siblings('.success-msg').remove();
      $event_start.alertMsg("Your event can't end before it begins<br>(check your hours) :P");
      return false;
    }
    if ((startHour-endHour) === 0) {
      if ((startMin-endMin) > 0 ) {
        console.log("min issue"+ "\n");
        $event_start.siblings('.success-msg').remove();
        $event_start.alertMsg("Your event can't end before it begins<br>(check your mins) :P");
        return false;
      }
    }
    // dates are equal, and times are sequential or equal
    return true;
  }
}

// given the diversity of names/nicknames/aliases, the only requirement for guests are a single character
// reminder: event_guests_status is not used for guestlist validation; it's only used for current input before submission
$event_guests.on('input change', function() {
  if ($event_guests.val().length > 0) {
    if (!event_guests_status) {
      event_guests_status = true;
      $event_guests.css('background', 'hsl(180, 96%, 90%)');
      $guests_button.css('background', 'hsl(180, 96%, 90%)');
    }
  } else {
    event_guests_status = false;
    $event_guests.css('background', 'hsl(0, 0%, 100%)');
    $guests_button.css('background', 'hsl(0, 0%, 100%)');
  }
});

// necessary to reset style detection after submit
$event_guests.on('focus', function() {
  event_guests_status = false;
});

// on blur, wait 125ms, then check if the input field is empty.  If not, make input field pink.
$event_guests.on('blur', function() {
  setTimeout(function() {
    if($event_guests.val().length == 0) {
      $event_guests.css('background', 'hsl(0, 0%, 100%)');
    } else {
      $event_guests.css('background', 'hsl(359, 96%, 90%)');
    }
    if(guest_array.length > 0) {
      alertSuccess($('#guests_inputs_div'));
    }
  }, 125);
});

// duplicates button click functionality by user clicking 'enter' key
$event_guests.on('keypress', function(e) {
  if (e.which == 13){
    $guests_button.trigger('click');
    $event_guests.css('background', 'hsl(0, 0%, 100%)');
  }
});

// event location validation listeners
$event_location.on('input change', function() {
  if (!event_location_status) {
    if ($event_location.val().length > 0) {
      event_location_status = true;
      $event_location.css('background', 'hsl(180, 96%, 90%)');
    } else {
      $event_location.css('background', 'hsl(359, 96%, 90%)');
    }
  } else {
    if ($event_location.val().length == 0) {
      event_location_status = false;
      $event_location.css('background', 'hsl(359, 96%, 90%)');
    }
  }
});
$event_location.on('blur', function() {
  if(event_location_status === true) {
    alertSuccess($(this));
  }
});

// ==========================================================================
// Login Validation
// ==========================================================================

/* Variable Assignments
=====================================*/

// input fields
var $name     = $('#name'),
    $email    = $('#email'),
    $password = $('#password');

// bools
var first_focus_name  = true,
    first_focus_email = true,
    first_focus_pass  = true,
    firstHourInput    = true;

// regEx
var reqNum    = new RegExp('[0-9]'),
    reqLow    = new RegExp('[a-z]'),
    reqUpp    = new RegExp('[A-Z]'),
    reqEmail  = new RegExp('^\\S+@\\S+[\\.][0-9a-z]+$');

// password requirements
var $validation_length      = $('#validation_length'),
    $validation_case        = $('#validation_case'),
    $validation_uppercase   = $('#validation_uppercase'),
    $validation_lowercase   = $('#validation_lowercase'),
    $validation_number      = $('#validation_number'),
    $password_requirements  = $('#password_requirements'),
    $incomplete_span,
    $complete_span;

// requirements state
var state_name      = false,
    state_email     = false,
    state_length    = false,
    state_case      = false,
    state_upperCase = false,
    state_lowerCase = false,
    state_number    = false,
    state_password  = false;

// HTML injection for password validation symbols
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

// establish incomplete symbols and class selection
function incompleteValidationPassword (portion) {
  if (!portion) {
    $validation_length.prepend($incomplete_symbol('length'));
    $validation_case.prepend($incomplete_symbol('case'));
    $validation_number.prepend($incomplete_symbol('number'));
    $incomplete_span = $('.incomplete-symbol');
  } else {

    // set individual params for incomplete symbol showing
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

// establish complete symbols and class selection
function completeValidationPassword (portion) {
  if (!portion) {
    $validation_length.prepend($complete_symbol('length'));
    $validation_case.prepend($complete_symbol('case'));
    $validation_number.prepend($complete_symbol('number'));
    $complete_span = $('.complete-symbol');
    $complete_span.hide();
  } else{

    // set individual params for complete symbol showing
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

// instantiate validation settings
incompleteValidationPassword();
completeValidationPassword();

/* Interactions
=====================================*/

// login name validation listeners
$name.on('blur', function() {
  if(state_name === true) {
    alertSuccess($(this));
  }
  // length value is checked first incase auto-fill has been used
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

// login email validation listeners
$email.on('blur', function() {
  if(state_email === true) {
    alertSuccess($(this));
  }
  // length value is checked first incase auto-fill has been used
  if ($email.val().length === 0 || !reqEmail.test($email.val())) {
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

// login password validation listeners
$password.on('focus', function(evt) {
  if (first_focus_pass) {
    $incomplete_span.attr('style', 'color:hsl(359, 96%, 70%)');
    $password.css('background', 'hsl(359, 96%, 90%)');
    $validation_lowercase.css('color', 'hsl(359, 96%, 70%)');
    $validation_uppercase.css('color', 'hsl(359, 96%, 70%)');
    first_focus_pass = false;
  }
});
$password.on('blur', function(evt) {
  if(state_password === true) {
    alertSuccess($(this));
  }
});
// password length/case/number validation listeners and functionality
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

// login continue button click functionality
$login_button.click(function() {
  clearAlerts();
  if (loginValidation()) {
    document.getElementById('login_form').reset();
    $login.hide();
    $view_events.show();
  } else {
    // no need for else, since loginValidation runs regardless
  }
});

// goto-profile button click functionality
$goto_profile_button.click(function() {
  clearAlerts();
  if (loginValidation()) {
    document.getElementById('login_form').reset();
    $login.hide();
    $profile.show();
    setAutofocus();
  } else {
    // no need for else, since loginValidation runs regardless
  }
});

// check login input states, creates alert messages when invalid/missing input, and returns true when all is well
function loginValidation() {
  if (state_name === false) {
    $name.alertMsg("Please type in your name or an alias.");
  }
  if (state_email === false) {
    $email.alertMsg("Please type in your email.<br>No email?  Use \"none@none.com\".");
  }
  if (state_password === false) {
    $password.alertMsg("Please adjust your password so it meets the requirements below.")
  }
  if (state_name && state_email && state_password) {
    return true;
  }
}

// ==========================================================================
// Places Search
// ==========================================================================

// location input var
var location_input = document.getElementById('location');

// use google maps places API for location_input
var location_searchBox = new google.maps.places.Autocomplete(location_input);

// jquery UI alert msg styling function.
// idea taken from giampo23 @https://forum.jquery.com/topic/how-to-apply-highlight-error-style
// *parameter functionality, customMsg, and `after` functionality added by me
(function($) {
  $.fn.alertMsg = function(customMsg) {
    if(customMsg === undefined) {
      customMsg = "Please complete this field";
    }
    var styledAlert = "<div class=\"ui-state-error ui-corner-all alert-msg\" style=\"padding: 0 .7em;\">";
      styledAlert += "<p><span class=\"ui-icon ui-icon-alert\" style=\"float: left; margin-right: .3em;\">";
      styledAlert += "</span><strong style='font-weight:900'>Required:</strong>";
      styledAlert += " " + customMsg;
      styledAlert += "</p></div>";
    this.after(styledAlert);
    // focus the first occurence of .alert-msg on the page
    var $firstAlert =$('.alert-msg:first');
    $firstAlert.parent().focus();
  };
})(jQuery);

// jquery UI success msg styling function
(function($) {
  $.fn.successMsg = function(customMsg) {
    if(customMsg === undefined) {
      customMsg = "Thank you :D";
    }
    var styledSuccess = "<div class=\"ui-state-highlight ui-corner-all success-msg\" style=\"padding: 0 .7em;\">";
      styledSuccess += "<p><span class=\"ui-icon ui-icon-alert\" style=\"float: left; margin-right: .3em;\">";
      styledSuccess += "</span><strong style='font-weight:900'>"+customMsg+"</strong>";
      styledSuccess += "</p></div>";
    this.after(styledSuccess);
  };
})(jQuery);

// when user inputs a start-hour for the first time, automatically set end-hour to start-hour+1
$('#start_hour_select-button').on('blur', function() {
  if (firstHourInput === true) {
    firstHourInput = false;
    var localStartHour = $('#start_hour_select-button .ui-selectmenu-text').text().replace(':', '');

    for(var i = 1; i < 13; i++) {
      if (i == localStartHour) {
        if (i < 12) {
          $('#end_hour_select-button .ui-selectmenu-text').html((i+1)+':');
        } else {
          $('#end_hour_select-button .ui-selectmenu-text').html((12)+':');
        }
      }
    }
  }
});

// .mask is from maskedInput.js
$phone_number.mask("(999) 999-9999");

// (called on blur) if alert message is active, and warnings are fixed, replace alertMsg with successMsg
function alertSuccess(element) {
  if (element.next().hasClass('alert-msg')) {
    element.siblings('.alert-msg').successMsg();
    element.siblings('.alert-msg').remove();
  }
}

// show create-event-close-icon when user scrolls to top of page, hide otherwise.  10px's provided for UX, especially on touch
$('#create_event_form').scroll( function () {
    var currentTop = $('#create_event_form').scrollTop();
    if (currentTop <= 10) {
        $('.create-event-close-icon').show();
    } else {
        $('.create-event-close-icon').hide();
    }
});

// close create-event button functionality (called on click of close-create-event-icon)
$('.create-event-close-icon').click(function() {
  closeEvent();
})

// close event button functionality
function closeEvent() {
  clearAlerts();
  postEventPrep();
  $create_event.hide();
}



// hide all pages, and show selected page on load.
hidePages();
$login.show();
// $profile.show();
// $view_events.show();
// $create_event.show();
setAutofocus();



