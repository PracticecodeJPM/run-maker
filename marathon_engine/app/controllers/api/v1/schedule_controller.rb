class Api::V1::ScheduleController < ApplicationController
  def initialize
    @rest = duplicate_string_array(18, "rest")
    @cross_train = duplicate_string_array(18, "cross-train")
    @full_marathon_program = {
      "short_run": [3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 4, 3, 3],
      "medium_run": [5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 5, 8, 5, 4, 3, 2, 2],
      "long_run": [5, 6, 7, 8, 10, 11, 12, 14, 16, 16, 17, 18, 19, 20, 22, 12, 8, 8],
      "rest": @rest,
      "cross_train": @cross_train
      }
  end

  def duplicate_string_array(multiplier, string)
    arr = []
    multiplier.times { arr << string }
    arr
  end

  def schedule_params
    params.require(:schedule).permit(:monday, :tuesday, :wednesday, :thursday, :friday, :saturday, :sunday)
  end

  def index
    respond_with Schedule.all
  end

  def show
    respond_with Schedule.find(params[:id])
  end

  def create
    respond_with Schedule.create(schedule_params)
  end

  def update
    respond_with Schedule.update(schedule_params)
  end

  def duplicate_string_array(multiplier, string)
    arr = []
    multiplier.times { arr << string }
    arr
  end
  
  def calendar 
    user_preferences = Schedule.find(params[:schedule_id])    
    respond_with schedule_engine(@full_marathon_program, user_preferences, 18)
  end 

  def start_date(race_day, weeks)
    # start_date is always a monday to allow full training weeks
    race_day - 7 * weeks - race_day.wday
  end

  def schedule_engine(training_program, user_data, weeks)
    training_schedule = {};
    race_day = user_data.raceday
    start_date = start_date(race_day, weeks)
    (start_date..race_day).each_with_index do |day, i|
      date_string = day.strftime('%x')
      if day == race_day
        training_schedule[date_string] = "race"
      elsif day == race_day - 1 || day == race_day - 2
        training_schedule[date_string] = "rest"
      else
        weekday = day.strftime('%A')
        activity = user_data[weekday.downcase.to_sym]
        activity_key = activity.parameterize.underscore.to_sym
        puts training_program[activity_key]
        puts activity_key
        training_schedule[date_string] = training_program[activity_key][i/7.to_i]
      end
    end
    training_schedule
  end
end
