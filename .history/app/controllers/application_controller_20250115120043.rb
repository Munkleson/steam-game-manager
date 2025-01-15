class ApplicationController < ActionController::Base
  before_action :check_session

  private

  def check_session
    @user_id = session[:user_id]
    if @user_id
      @user = User.find(@user_id)
    elsif !request.path.include?("/add_games") && !request.path.include?("/steam")
      redirect_to add_games_path, alert: "Your session has expired. Please log in again"
    end
  endend
