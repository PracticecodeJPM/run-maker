var runSched = angular.module('RunSched', []);
runSched.controller('UserController', function($scope) {
  $scope.username = "John";
});

$(document).ready(function(){

  // load datepicker from pickadate lib
  $('#datepicker').pickadate();

  // create drag and drop objects
  $('.pep').pep({
    droppable: ".dropzone",
    place: false,
    drag: function(ev, obj) {
      $(this.el).toggleClass('selected', false);
      if (typeof(this.activeDropRegions[0]) !== "undefined" && this.activeDropRegions.length === 1) {
        $(this.el).toggleClass('selcted', true);
      }
    },
    stop: function(ev, obj) {
      week = $('#activityForm').children("input");
      activity = ev.target.innerText;
      // check if activity already exists in a day
      week.map(function(input){
        if ($(week[input]).val() === activity){
          $(week[input]).val("")
        };
      });
      // on dropping activity into a day
      if (typeof(this.activeDropRegions[0]) !== "undefined" && this.activeDropRegions.length === 1) {
        day = this.activeDropRegions[0].context.innerText;
        // fill input with activity
        document.getElementById(day).value = activity;
      };
    },
    revert: true,
    revertIf: function() {
      week = $('#activityForm').children("input");
      // check for object alread occupying a day
      if (typeof(this.activeDropRegions[0]) !== "undefined") {
        day = this.activeDropRegions[0].context.innerText;
        activity = this.$el.innerText
        occupied = ($('input#' + day).val() !== "" || $('input#' + day).val() === activity);
      } else {
        occupied = false;
      }
      return typeof(this.activeDropRegions[0]) === "undefined" ||
             !(this.activeDropRegions.length === 1) ||
             occupied
    },
  });

  $('#activityForm').submit(function( event ) {
    event.preventDefault();
    if (validateForm()) {
    }
  });

  function validateForm() {
    var mo = $('#Monday').val();
    var tu = $('#Tuesday').val();
    var we = $('#Wednesday').val();
    var th = $('#Thursday').val();
    var fr = $('#Friday').val();
    var sa = $('#Saturday').val();
    var su = $('#Sunday').val();
    var date = $('#datepicker').val();

    if (!mo || !tu || !we || !th || !fr || !sa || !su) {
      errorMessage("Make sure all days are filled in!");
      return false;
    } else if (!date) {
      errorMessage("Make sure your date is filled in!");
      return false;
    }
    return true;
  }

  function errorMessage(text) {
    $('#errorMessage').html(text);
    $('#errorMessage').slideDown(function() {
        setTimeout(function() {
            $('#errorMessage').slideUp();
        }, 2000);
    });
  }

  function Training(date, activity) {
    this.date = date;
    this.activity = activity;
  }

});
