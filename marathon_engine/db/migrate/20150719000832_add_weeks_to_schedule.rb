class AddWeeksToSchedule < ActiveRecord::Migration
  def change
    add_column :schedules, :weeks, :integer
  end
end
