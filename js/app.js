// (function(){
// angular.module('train', [])
//   .controller("TrainingController",['$scope', function($scope) {
//     $scope.schedule = sched
//     $scope.days = {};
//     $scope.parent = {monday:''};
//
//     $scope.printSchedule = function(){
//       $scope.$apply(function () {
//         console.log("printSchedule");
//         console.log($scope.parent.monday);
//       });
//     }
//
//   }]);
//
//   var sched = [{date: "Thu Mar 10th, 2015", activity: "run"},
//                   {date: "Fri Mar 11th, 2015", activity: "jog"}];
//


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


  // creating the schedule
  short_run = [3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 4, 3, 3];
  medium_run = [5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 5, 8, 5, 4, 3, 2, 2];
  long_run = [5, 6, 7, 8, 10, 11, 12, 14, 16, 16, 17, 18, 19, 20, 22, 12, 8, 8];

  Handlebars.registerHelper('everyNth', function(context, every, options) {
  var fn = options.fn, inverse = options.inverse;
  var ret = "";
  if(context && context.length > 0) {
    for(var i=0, j=context.length; i<j; i++) {
      var modZero = i % every === 0;
      ret = ret + fn(_.extend({}, context[i], {
        isModZero: modZero,
        isModZeroNotFirst: modZero && i > 0,
        isLast: i === context.length - 1
      }));
    }
  } else {
    ret = inverse(this);
  }
  return ret;
  });

  var positionCounter = 1;

  Handlebars.registerHelper('position', function() {
      return positionCounter++;
  });

  var source = $('#template').html();
  var template = Handlebars.compile(source);

  $('#activityForm').submit(function( event ) {
    event.preventDefault();
    if (validateForm()) {
      var trainingArray = $( this ).serializeArray();
      var dayToActivity = matchDayToActivity(trainingArray);
      var schedule = printSchedule(dayToActivity);
      console.log(schedule);
      var rendered = template({schedule: schedule});
      $('#target').html(rendered);
      $('#collapsePanel').collapse('hide');
      positionCounter = 1; // reset week counter
    }
  });

  function printSchedule(dayToActivity) {
      var runs = createTrainingGenerators(short_run, medium_run, long_run);
      schedule = createTrainingSchedule(dayToActivity, runs);
      return schedule;
  }

  function createTrainingGenerators(short_run, medium_run, long_run) {
    var short_run_gen = makeIterator(short_run);
    var short_run_gen2 = makeIterator(short_run);
    var med_run_gen = makeIterator(medium_run);
    var long_run_gen = makeIterator(long_run);
    return {
      short: short_run_gen,
      shortTwo: short_run_gen2,
      medium: med_run_gen,
      long: long_run_gen
    }
  }

  function createTrainingSchedule(dayToActivity, runs, train) {
    var rawDate = dayToActivity['rawDate'];
    var raceDate = moment(rawDate, 'DD MMM, YYYY');
    var dayBeforeRace = moment(rawDate).subtract(1, 'd');
    var twoDaysBeforeRace = moment(rawDate).subtract(2, 'd');
    var startDate = moment(rawDate).subtract(18, 'w').subtract(raceDate.weekday() - 1, 'd');
    var schedule = [];

    for (day = startDate; day.isBefore(raceDate) || day.isSame(raceDate); day.add(1, 'd')) {
      var trainingDate = day.format("MMM Do");
      // check for race date or the two days before race date
      if (day.isSame(raceDate)) {
        var trainingActivity = "Race Day";
      } else if (day.isSame(dayBeforeRace) || day.isSame(twoDaysBeforeRace)){
        var trainingActivity = "rest";
      } else {
      // normal training program
        weekday = day.format('dddd');
        switch(dayToActivity[weekday]) {
          case 'Short Run 1':
            var trainingActivity = runs.short.next().value.toString()  + " miles";
            break;
          case "Medium Run":
            var trainingActivity = runs.medium.next().value.toString()  + " miles";
            break;
          case "Short Run 2":
            var trainingActivity = runs.shortTwo.next().value.toString()  + " miles";
            break;
          case "Rest 1":
          // fall through
          case "Rest 2":
            var trainingActivity = "rest";
            break;
          case "Cross Train":
            var trainingActivity = "cross-train";
            break;
          case "Long Run":
            var trainingActivity = runs.long.next().value.toString() + " miles";
            break
        }
      }
      var trainingDay =  new Training(trainingDate, trainingActivity);
      schedule.push(trainingDay);
    }
    return schedule;
  }


  function matchDayToActivity(trainingArray) {
    var dayToActivity = {};
    for (var i=0; i < trainingArray.length; i++) {
      var day = trainingArray[i].name;
      var activity = trainingArray[i].value;
      dayToActivity[day] = activity;
    }
    return dayToActivity
  }

  function makeIterator(array){
      var nextIndex = 0;
      return {
         next: function(){
             return nextIndex < array.length ?
                 {value: array[nextIndex++], done: false} :
                 {done: true};
         }
      }
  }

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
