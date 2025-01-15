class ApplicationController < ActionController::Base
  before_action :set_user_id

  private

  @user_id = session[:user_id]
  if @user_id
    @user = User.find(@user_id)
  elsif !request.path.include?("/add_games") && !request.path.include?("/steam")
    redirect_to add_games_path, alert: "Your session has expired. Please log in again"
  end

  # helper_method :current_user

  # def current_user
  #   @current_user ||= User.find_by(id: session[:user_id])
  # end
end
