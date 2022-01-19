9.times do |i|
  Task.create(
    title: "Task #{i + 1}",
    description: "Description #{i + 1}",
    deadline: Date.today.advance(days: rand(0..100)),
    tag: "test"
  )
end