# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
require "Date"

run_options = ["short run", "rest", "long run", "medium run", "cross train"]

def random_date_in_year(year)
    return rand(Date.civil(year.min, 1, 1)..Date.civil(year.max, 12, 31)) if year.kind_of?(Range)
    rand(Date.civil(year, 1, 1)..Date.civil(year, 12, 31))
end

100.times do |i|
  Schedule.create(monday: run_options.sample,
                  tuesday: run_options.sample,
                  wednesday: run_options.sample,
                  thursday: run_options.sample,
                  friday: run_options.sample,
                  saturday: run_options.sample,
                  sunday: run_options.sample,
                  raceday: random_date_in_year(2016)
                 )
end
