class CreateTasks < ActiveRecord::Migration[7.0]
  def change
    create_table :tasks do |t|
      t.string :title, null:false
      t.text :description, null:false
      t.datetime :deadline, null:false

      t.timestamps
    end
  end
end
