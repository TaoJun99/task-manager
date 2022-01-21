Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :tasks do
        resources :sub_tasks
        put '/sub_tasks/:id/status', to: 'sub_tasks#status'
      end
      put '/tasks/:id/status', to: 'tasks#status'

    end
  end
  root 'homepage#index'
  get '/*path' => 'homepage#index'
end
