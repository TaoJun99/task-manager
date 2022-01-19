Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :tasks do
        resources :sub_tasks
      end
    end
  end
  root 'homepage#index'
  get '/*path' => 'homepage#index'
end
