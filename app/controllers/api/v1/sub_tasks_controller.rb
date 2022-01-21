class Api::V1::SubTasksController < ApplicationController
  def index
    subtasks = task.sub_tasks.all.order(:id)
    render json: subtasks
  end

  def create
    subtask = task.sub_tasks.create(description: subtask_params[:description], status: :incomplete)
    if subtask
      index
    else
      render json: subtask.errors
    end
  end

  def show
    if subtask
      render json: {description: subtask.description, status: task.status}
    end
  end

  def destroy
    subtask&.destroy
    render json: { message: 'Subtask deleted!'}
  end

  def update
    subtask.update(subtask_params)
  end

  def status
    if subtask.status === "incomplete"
      subtask.complete!
    else
      subtask.incomplete!
    end
    index
  end

  private
  def subtask_params
    params.permit(:description, :status)
  end

  def task
    @task = Task.find(params[:task_id])
  end

  def subtask
    @subtask = task.sub_tasks.find(params[:id])
  end
end
