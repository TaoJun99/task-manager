class Task < ApplicationRecord
  validates :title, presence: true
  validates :description, presence: true
  validates :deadline, presence: true
  validates :tag, presence: true

  enum :status, [ :incomplete, :complete, :overdue ], default: :incomplete
  validates :status, inclusion: { in: statuses.keys }

  has_many :sub_tasks, dependent: :destroy
end
