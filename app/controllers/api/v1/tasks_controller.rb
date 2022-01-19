class Api::V1::TasksController < ApplicationController
  def index
    tasks = Task.all.order(:deadline)
    render json: tasks
  end

  def create
    task = Task.create(
      title: task_params[:title],
      description: task_params[:description],
      deadline: DateTime.parse(task_params[:deadline]),
      tag: task_params[:tag])
    if task
      render json: task
    else
      render json: task.errors
    end
  end

  def show
    if task
      render json: task
      # render json: { title: task.title, description: task.description,
      #                deadline: task.deadline.strftime("%d %b %Y, %H%M"), status: task.status }
    else
      render json: task.errors
    end


  end

  def destroy
    task&.destroy
    render json: { message: 'Task deleted!'}
  end

  def update
    if task_params[:status] === "complete"
      task.complete!
    elsif task_params[:status] === "incomplete"
      task.incomplete!
    end

    task.update(task_params)
  end

  private
  def task_params
    params.permit(:title, :description, :deadline, :status, :tag)
  end

  def task
    @task = Task.find(params[:id])
  end
end
