class Api::V1::SubTasksController < ApplicationController
  def index
    subtasks = task.sub_tasks.all
    render json: subtasks
  end

  def create
    subtask = task.sub_tasks.create(description: subtask_params[:description], status: :incomplete)
    if subtask
      render json: subtask
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
    if subtask_params[:status] === "complete"
      subtask.complete!
    elsif subtask_params[:status] === "incomplete"
      subtask.incomplete!
    end

    subtask.update(subtask_params)
  end

  private
  def subtask_params
    params.permit(:description, :status)
  end

  def subtask
    @subtask = SubTask.find(params[:id])
  end

  def task
    @task = Task.find(params[:task_id])
  end
end
