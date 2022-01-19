class CreateSubTasks < ActiveRecord::Migration[7.0]
  def change
    create_table :sub_tasks do |t|
      t.text :description
      t.integer :status
      t.references :task, null: false, foreign_key: true

      t.timestamps
    end
  end
end
