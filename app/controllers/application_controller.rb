class ApplicationController < ActionController::Base
  before_action :set_user_id

  private

  def set_user_id
    @user_id = 2
    @user = User.find(@user_id)
  end
end
