'use strict';
/*global $:false*/

// ==========================================================================
// Pages
// ==========================================================================

// 1. There's a bug with the create_event div's size, especially on small mobile.
//    It makes it so you can scroll through your events while you have the create_event
//    window open.
// 2. I need to style the events
// 3. There's a bug with event open/close lag on my iPad pro, maybe all iOS



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
    $event_location     = $('#location'),
    $event_message      = $('#guest_message');

// Add guest functionality
var new_guest,
    guest_div,
    first_guest = true,
    guest_array = [],
    guest_id = 0;

function createGuestDiv(guestName) {

  guest_div = "<div id='guest"+guest_id+"' class='new-guests'>" +
                "<span class='guest-span'>"+guestName+"</span>" +
                "<button type='button' class='guest-remove'> x</button>" +
              "</div>";
  return guest_div;
}

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

// when x button clicked, delete that guest from guest list
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

// Create Date and Time inputs
$('#birthday').datepicker({ changeYear: true, yearRange: "1900:2016" });

$event_start.datepicker({
  dateFormat: 'M d, yy'
});
$event_start_hour.selectmenu();
$event_start_minute.selectmenu();
$event_start_ampm.selectmenu();

$event_end.datepicker({
  dateFormat: 'M d, yy'
});
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
    guests = [],
    multiday = false,
    multiDash = "",
    duration = false,
    durationDash = "",
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

  var sameYear  = false,
      sameMonth = false,
      sameDay   = false,
      sameTime  = false,
      sameDate  = true;

  var guestList = "";

  if (event_start_year == event_end_year) {
    console.log(event_start_year)
    console.log(" ^^ sameYear");
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

  eventDiv =  "<div class='event' id='eventNum"                                         +eventId                                        +"'>" +
              "<div class='event-name event-visible'>"                                  +$event_name.val()                              +"</div>" +
              "<div class='event-type event-invisible' style='display: none;'>"         +$event_type.val()                              +"</div>" +
              "<div class='event-host event-visible'>Host: "                            +$event_host.val()                              +"</div>" +
              "<div class='event-start event-visible'>"                                 +event_start_display+multiDash+event_end_display+"</div>" +
              "<div class='event-start-time event-invisible' style='display: none;'>"   +event_start_time+durationDash+event_end_time   +"</div>" +
              // "<div class='event-end event-invisible' style='display: none;'>"          +event_end_display                              +"</div>" +
              // "<div class='event-end-time event-invisible' style='display: none;'>"     +event_end_time                                 +"</div>" +
              "<div class='event-location event-invisible' style='display: none;'>"     +$event_location.val()                          +"</div>" +
              "<div class='event-message event-invisible' style='display: none;'>"      +$event_message.val()                           +"</div>" +
              "<div class='event-guests-count event-invisible' style='display: none;'>" +guest_array.length                             +" Guests</div>" +
              "<div class='event-guests-names event-invisible' style='display: none;'>" +guestList                                      +"</div>" +
              "</div>";

  multiDash = "";
  return eventDiv;
}

$create_event_button.click(function() {
  clearAlerts();
  eventValidation();
});

  // this is where final validation will occur
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

  if (event_name_status && event_type_status && event_host_status && event_start_status && event_end_status && event_time_status && guest_array.length > 0 && event_location_status) {
    currentEventDiv = eventContainerContent();
    $events_container.append(currentEventDiv);
    newEventClickListener(eventId);

    postEventPrep();
    $create_event.hide();
  }
}

// click listener for fake (example/placeholder) events
$('.fake-event').click(function() {
  $(this).children('.event-invisible').slideToggle();
});

function newEventClickListener(currentID) {
  $('.event#eventNum'+ currentID).click(function() {
    $(this).children('.event-invisible').slideToggle();
  });
}

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

  // Not very DRY, but it does the job.  A less DRY way would be if I used OOP for events,
  // and looped through all instances.  :sad-face:
  event_name_status     =   false;
  event_type_status     =   false;
  event_host_status     =   false;
  event_start_status    =   false;
  event_end_status      =   false;
  event_time_status     =   false;
  event_message_status  =   false;
  event_guests_status   =   false;
  event_location_status =   false;
  event_status          =   false;
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

function clearAlerts() {
   $('.alert-msg, .success-msg').remove();
}

// ==========================================================================
// Event Validation
// ==========================================================================

var event_name_status     = false,
    event_type_status     = false,
    event_host_status     = false,
    event_start_status    = false,
    event_end_status      = false,
    event_time_status     = false,
    event_message_status  = false,
    event_guests_status   = false,    // This value is used to check current input status, not guestlist status.
    event_location_status = false,    // Use guest_array.length to affirm guestlist status.
    event_status          = false,
    status_array          = false;    // Currently Unused

var event_name_error        = "Please name your event",
    event_type_error        = "Please specify the type of your event"+"<br>"+"for example: \"birthday\"",
    event_host_error        = "Please name the host of your event",
    event_time_type_error   = "Please select a date from the calendar or"+"<br>"+"use mm/dd/yyyy format",
    event_time_switch_error = "Oops!  Your event can't end before it begins!",
    event_guests_error      = "Please add at least one guest to your event"+"<br>"+"even if it's just you",
    event_location_error    = "Please add a location for your event",
    event_status_error      = "";

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
    $event_start.val($.datepicker.formatDate('M d, yy', new Date($event_start.val()))) // normalizes any accepted date format to 'M d, yy'
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
    $event_end.val($.datepicker.formatDate('M d, yy', new Date($event_end.val()))) // normalizes any accepted date format to 'M d, yy'
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

$('#start_time, #end_time, #start_hour_select-button, #start_minute_select-button, #start_ampm_select-button, #end_hour_select-button, #end_minute_select-button, #end_ampm_select-button').on('blur', function() {
  if(compareTime($event_start.val(), $event_end.val())) {
    alertSuccess($event_start);
    alertSuccess($event_end);
  }
});

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

// Given the diversity of names/nicknames/aliases, the only requirement for guests are a single character
// Reminder: event_guests_status is not used for guestlist validation; it's only used for current input before submission
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

// Necessary to reset style detection after submit
$event_guests.on('focus', function() {
  event_guests_status = false;
});

// On blur, wait 125ms, then check if the input field is empty.  If not, make input field pink.
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

// Duplicates button click functionality by user clicking 'enter' key
$event_guests.on('keypress', function(e) {
  if (e.which == 13){
    $guests_button.trigger('click');
    $event_guests.css('background', 'hsl(0, 0%, 100%)');
  }
});

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

// Input Fields
var $name     = $('#name'),
    $email    = $('#email'),
    $password = $('#password');

// Bools
var first_focus_name  = true,
    first_focus_email = true,
    first_focus_pass  = true,
    firstHourInput    = true;

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

$name.on('blur', function() {
  if(state_name === true) {
    alertSuccess($(this));
  }
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

$email.on('blur', function() {
  if(state_email === true) {
    alertSuccess($(this));
  }
  // Length value is checked first incase auto-fill has been used
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
  if(state_password === true) {
    alertSuccess($(this));
  }
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

$login_button.click(function() {
  clearAlerts();
  if (loginValidation()) {
    document.getElementById('login_form').reset();
    $login.hide();
    $view_events.show();
  } else {

  }
});

$goto_profile_button.click(function() {
  clearAlerts();
  if (loginValidation()) {
    document.getElementById('login_form').reset();
    $login.hide();
    $profile.show();
    // setAutofocus();  --> Note to reviewer: I didn't set autofocus here because
  } else {               // I found it to detriment the UX

  }
});

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

var location_input = document.getElementById('location');

var location_searchBox = new google.maps.places.Autocomplete(location_input);

// jquery UI alert msg styling function
// Idea taken from giampo23 @https://forum.jquery.com/topic/how-to-apply-highlight-error-style
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

var $phone_num = $('#phone_number');
// .mask is from maskedInput.js
$phone_num.mask("(999) 999-9999");

// (Called on blur) If alert message is active, and warnings are fixed, replace alertMsg with successMsg
function alertSuccess(element) {
  if (element.next().hasClass('alert-msg')) {
    element.siblings('.alert-msg').successMsg();
    element.siblings('.alert-msg').remove();
  }
}



// call on page load
hidePages();
$view_events.show();
// $login.show();
// $create_event.show();
setAutofocus();



