class ScheduleController < ApplicationController
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
end
