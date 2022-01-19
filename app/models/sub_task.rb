class SubTask < ApplicationRecord
  belongs_to :task
  validates :description, presence: true

  enum :status, [ :incomplete, :complete, :overdue ], default: :incomplete
  validates :status, inclusion: { in: statuses.keys }
end
