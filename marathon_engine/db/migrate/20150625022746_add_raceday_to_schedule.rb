class AddRacedayToSchedule < ActiveRecord::Migration
  def change
    add_column :schedules, :raceday, :date
  end
end
