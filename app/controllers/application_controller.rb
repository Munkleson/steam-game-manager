class ApplicationController < ActionController::Base
  before_action :set_user_id

  private

  def set_user_id
    @user_id = session[:user_id]
    if @user_id
      @user = User.find(@user_id)
    end
    # session[:user_id] = nil
    # reset_session
  end

  helper_method :current_user

  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end
end
