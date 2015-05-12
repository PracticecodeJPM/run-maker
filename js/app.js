(function(){
angular.module('train', [])
  .controller("TrainingSchedule", function() {
    this.schedule = {};

    this.updateSchedule = function(trainingDay, activity){
      this.schedule[trainingDay] = activity;
    };
  });
})();

$(document).ready(function(){

  $('.pep').pep({
    droppable: ".dropzone",
    place: false,
    drag: function(ev, obj) {
      console.log('toggleclass');
      $(this.el).toggleClass('selected', false);
      if (typeof(this.activeDropRegions[0]) !== "undefined" && this.activeDropRegions.length === 1) {
        console.log("selected");
        console.log(this);
        $(this.el).toggleClass('selcted', true);
      }
    },
    stop: function(ev, obj) {
      if (typeof(this.activeDropRegions[0]) !== "undefined" && this.activeDropRegions.length === 1) {
        console.log(this.activeDropRegions.length)
        console.log(ev.target.innerText);
        console.log(this.activeDropRegions[0].context.innerText);
      };
    },
    revert: true,
    revertIf: function() {
      console.log(typeof(this.activeDropRegions[0]) === "undefined")
      return typeof(this.activeDropRegions[0]) === "undefined";
    },
  });

});
