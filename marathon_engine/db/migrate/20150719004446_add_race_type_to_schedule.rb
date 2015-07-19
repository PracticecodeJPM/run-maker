class AddRaceTypeToSchedule < ActiveRecord::Migration
  def change
    add_column :schedules, :race_type, :string
  end
end
